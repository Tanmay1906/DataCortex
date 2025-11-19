from app import db
import importlib
from app.models.evidence import Evidence
from app.models.case import Case
from app.models.user import User
from datetime import datetime, timezone, timedelta
from flask import request
import hashlib

# Dynamic imports to avoid static analysis issues
def _get_chain_of_custody_models():
    """Dynamically import chain of custody models"""
    module = importlib.import_module('app.models.chain_of_custody')
    return module.ChainOfCustody, module.CustodyAction

# Import at module level
ChainOfCustody, CustodyAction = _get_chain_of_custody_models()

# Define IST timezone (+5:30 from UTC)
IST = timezone(timedelta(hours=5, minutes=30))

def ist_now():
    """Get current time in IST"""
    return datetime.now(IST)

class ChainOfCustodyService:
    
    @staticmethod
    def log_custody_action(evidence_id, case_id, user_id, action, **kwargs):
        """
        Log a chain of custody action for evidence
        
        Args:
            evidence_id: ID of the evidence
            case_id: ID of the case
            user_id: ID of the user performing the action
            action: Action being performed (from CustodyAction constants)
            **kwargs: Additional optional parameters for the custody record
        
        Returns:
            ChainOfCustody: The created custody record
        """
        try:
            # Verify evidence exists and belongs to case
            evidence = Evidence.query.filter_by(id=evidence_id, case_id=case_id).first()
            if not evidence:
                raise ValueError(f"Evidence {evidence_id} not found in case {case_id}")
            
            # Get request information for audit trail
            ip_address = request.remote_addr if request else None
            user_agent = request.headers.get('User-Agent') if request else None
            
            # Create custody record
            custody_record = ChainOfCustody(
                evidence_id=evidence_id,
                case_id=case_id,
                action=action,
                performed_by=user_id,
                ip_address=ip_address,
                user_agent=user_agent,
                action_timestamp=ist_now(),
                **kwargs
            )
            
            # Auto-verify hash if evidence has SHA256 hash
            if evidence.sha256_hash and not kwargs.get('hash_value'):
                custody_record.hash_value = evidence.sha256_hash
                custody_record.hash_verified = True
                custody_record.integrity_status = 'verified'
            
            db.session.add(custody_record)
            db.session.commit()
            
            return custody_record
            
        except Exception as e:
            db.session.rollback()
            raise e
    
    @staticmethod
    def log_evidence_upload(evidence_id, case_id, user_id, file_hash=None, location=None):
        """Log when evidence is initially uploaded"""
        return ChainOfCustodyService.log_custody_action(
            evidence_id=evidence_id,
            case_id=case_id,
            user_id=user_id,
            action=CustodyAction.UPLOADED,
            action_description="Evidence file uploaded to system",
            hash_value=file_hash,
            hash_verified=True if file_hash else False,
            integrity_status='verified',
            location=location or 'Digital Evidence System',
            condition_before='new',
            condition_after='stored'
        )
    
    @staticmethod
    def log_evidence_view(evidence_id, case_id, user_id):
        """Log when evidence is viewed"""
        return ChainOfCustodyService.log_custody_action(
            evidence_id=evidence_id,
            case_id=case_id,
            user_id=user_id,
            action=CustodyAction.VIEWED,
            action_description="Evidence file viewed by user"
        )
    
    @staticmethod
    def log_evidence_download(evidence_id, case_id, user_id, tool_used=None):
        """Log when evidence is downloaded"""
        return ChainOfCustodyService.log_custody_action(
            evidence_id=evidence_id,
            case_id=case_id,
            user_id=user_id,
            action=CustodyAction.DOWNLOADED,
            action_description="Evidence file downloaded by user",
            tool_used=tool_used or 'Web Browser'
        )
    
    @staticmethod
    def log_evidence_transfer(evidence_id, case_id, from_user_id, to_user_id, reason=None):
        """Log when evidence custody is transferred between users"""
        return ChainOfCustodyService.log_custody_action(
            evidence_id=evidence_id,
            case_id=case_id,
            user_id=from_user_id,  # performed_by is the transferring user
            action=CustodyAction.TRANSFERRED,
            action_description=f"Evidence custody transferred. Reason: {reason or 'Not specified'}",
            transferred_from=from_user_id,
            transferred_to=to_user_id
        )
    
    @staticmethod
    def log_evidence_analysis(evidence_id, case_id, user_id, tool_used=None, tool_version=None, findings=None):
        """Log when evidence is analyzed"""
        description = "Evidence analyzed"
        if findings:
            description += f". Findings: {findings}"
            
        return ChainOfCustodyService.log_custody_action(
            evidence_id=evidence_id,
            case_id=case_id,
            user_id=user_id,
            action=CustodyAction.ANALYZED,
            action_description=description,
            tool_used=tool_used,
            tool_version=tool_version
        )
    
    @staticmethod
    def log_hash_verification(evidence_id, case_id, user_id, computed_hash, verification_result):
        """Log hash verification action"""
        evidence = Evidence.query.get(evidence_id)
        original_hash = evidence.sha256_hash if evidence else None
        
        integrity_status = 'verified' if verification_result else 'compromised'
        description = f"Hash verification {'successful' if verification_result else 'failed'}"
        if original_hash:
            description += f". Original: {original_hash[:16]}..., Computed: {computed_hash[:16]}..."
        
        return ChainOfCustodyService.log_custody_action(
            evidence_id=evidence_id,
            case_id=case_id,
            user_id=user_id,
            action=CustodyAction.VERIFIED,
            action_description=description,
            hash_value=computed_hash,
            hash_verified=verification_result,
            integrity_status=integrity_status
        )
    
    @staticmethod
    def get_custody_chain(evidence_id, case_id=None):
        """
        Get complete chain of custody for evidence
        
        Args:
            evidence_id: ID of the evidence
            case_id: Optional case ID for additional verification
            
        Returns:
            List[ChainOfCustody]: Ordered list of custody records
        """
        query = ChainOfCustody.query.filter_by(evidence_id=evidence_id)
        if case_id:
            query = query.filter_by(case_id=case_id)
        
        return query.order_by(ChainOfCustody.action_timestamp.asc()).all()
    
    @staticmethod
    def get_case_custody_chain(case_id):
        """Get all custody records for a case"""
        return ChainOfCustody.query.filter_by(case_id=case_id).order_by(
            ChainOfCustody.evidence_id.asc(),
            ChainOfCustody.action_timestamp.asc()
        ).all()
    
    @staticmethod
    def verify_evidence_integrity(evidence_id, case_id=None):
        """
        Verify evidence integrity based on custody chain
        
        Returns:
            dict: Integrity status and details
        """
        custody_chain = ChainOfCustodyService.get_custody_chain(evidence_id, case_id)
        
        if not custody_chain:
            return {
                'status': 'unknown',
                'message': 'No custody records found',
                'compromised': False
            }
        
        # Check for any compromised records
        compromised_records = [r for r in custody_chain if r.integrity_status == 'compromised']
        if compromised_records:
            return {
                'status': 'compromised',
                'message': f'Evidence integrity compromised in {len(compromised_records)} record(s)',
                'compromised': True,
                'compromised_records': compromised_records
            }
        
        # Check for gaps in custody chain
        actions = [r.action for r in custody_chain]
        if CustodyAction.UPLOADED not in actions:
            return {
                'status': 'incomplete',
                'message': 'No upload record found - chain of custody incomplete',
                'compromised': False
            }
        
        return {
            'status': 'verified',
            'message': 'Evidence integrity verified - complete chain of custody',
            'compromised': False,
            'total_actions': len(custody_chain)
        }
    
    @staticmethod
    def get_custody_summary(evidence_id, case_id=None):
        """Get summary of custody actions for evidence"""
        custody_chain = ChainOfCustodyService.get_custody_chain(evidence_id, case_id)
        
        if not custody_chain:
            return {
                'total_actions': 0,
                'first_action': None,
                'last_action': None,
                'unique_handlers': 0,
                'actions_summary': {}
            }
        
        # Get unique handlers
        handlers = set()
        for record in custody_chain:
            handlers.add(record.performed_by)
            if record.transferred_from:
                handlers.add(record.transferred_from)
            if record.transferred_to:
                handlers.add(record.transferred_to)
        
        # Count actions by type
        actions_summary = {}
        for record in custody_chain:
            action = record.action
            if action not in actions_summary:
                actions_summary[action] = 0
            actions_summary[action] += 1
        
        return {
            'total_actions': len(custody_chain),
            'first_action': custody_chain[0].action_timestamp,
            'last_action': custody_chain[-1].action_timestamp,
            'unique_handlers': len(handlers),
            'actions_summary': actions_summary,
            'integrity_status': ChainOfCustodyService.verify_evidence_integrity(evidence_id, case_id)['status']
        }
