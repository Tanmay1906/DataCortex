from app.models.evidence import Evidence
from app.models.user import User
from app.models.case import Case
from app import db
from datetime import datetime, timezone, timedelta
from app.services.blockchain_services import BlockchainService
from app.utils.file_utils import save_uploaded_file, compute_file_hash
import os
import hashlib

# Define IST timezone
IST = timezone(timedelta(hours=5, minutes=30))

class EvidenceService:
    @staticmethod
    def create_evidence(case_id, filename, original_name, file_size, mime_type, sha256_hash, blockchain_tx_hash, description, uploaded_by, file_path=None):
        """Create a new evidence record"""
        evidence = Evidence(
            case_id=case_id,
            filename=filename,
            original_name=original_name,
            file_path=file_path,
            file_size=file_size,
            mime_type=mime_type,
            sha256_hash=sha256_hash,
            blockchain_tx_hash=blockchain_tx_hash,
            description=description,
            uploaded_by=uploaded_by,
            status='active',
            created_at=datetime.now()
        )
        
        db.session.add(evidence)
        db.session.commit()
        
        return evidence
    
    @staticmethod
    def update_evidence_file_path(evidence_id, file_path):
        """Update the file path for an evidence record"""
        evidence = Evidence.query.get(evidence_id)
        if evidence:
            evidence.file_path = file_path
            db.session.commit()
            return evidence
        return None
    
    @staticmethod
    def upload_evidence(case_id, file, user_id):
        # Verify case exists and belongs to the user
        case = Case.query.filter_by(id=case_id, uploaded_by=user_id).first()
        if not case:
            raise ValueError("Case not found or you don't have permission to upload evidence to this case")
        
        # Prevent evidence upload to completed cases
        if case.is_completed:
            raise ValueError("Cannot upload evidence to a completed case")
        
        # Verify user exists
        user = User.query.get_or_404(user_id)
        
        # Save file and compute hash
        filename, file_path = save_uploaded_file(file)
        sha256_hash = compute_file_hash(file_path)
        
        # Log to blockchain
        tx_hash = BlockchainService.log_evidence_to_blockchain(case_id, sha256_hash)
        
        # Save evidence record
        evidence = Evidence(
            case_id=case_id,
            filename=filename,
            file_path=file_path,
            sha256_hash=sha256_hash,
            blockchain_tx_hash=tx_hash,
            uploaded_by=user_id
        )
        
        db.session.add(evidence)
        db.session.commit()
        
        return evidence
    
    @staticmethod
    def get_evidence_by_case(case_id, user_id=None):
        """Get evidence for a case, optionally filtered by user permissions"""
        if user_id:
            # First check if the user owns the case
            case = Case.query.filter_by(id=case_id, uploaded_by=user_id).first()
            if not case:
                return []  # Case doesn't exist or user doesn't own it
        
        return Evidence.query.filter_by(case_id=case_id).order_by(Evidence.uploaded_at.desc()).all()
    
    @staticmethod
    def get_evidence_by_user(user_id):
        """Get all evidence uploaded by a specific user"""
        return Evidence.query.filter_by(uploaded_by=user_id).order_by(Evidence.uploaded_at.desc()).all()
    
    @staticmethod
    def get_evidence_file(evidence_id, user_id=None):
        """Get evidence file, optionally filtered by user permissions"""
        evidence = Evidence.query.get_or_404(evidence_id)
        
        if user_id:
            # Check if user owns the case or uploaded the evidence
            case = Case.query.filter_by(id=evidence.case_id, uploaded_by=user_id).first()
            if not case and evidence.uploaded_by != user_id:
                raise PermissionError("You don't have permission to access this evidence")
        
        if not os.path.exists(evidence.file_path):
            raise FileNotFoundError("Evidence file not found")
        return evidence
    
    @staticmethod
    def get_audit_logs_by_case(case_id, user_id):
        """Get audit logs for a case - for now return mock data that will be replaced with real audit table"""
        # This would typically query an audit_logs table
        # For now, return structured data based on evidence actions
        
        evidences = Evidence.query.filter_by(case_id=case_id).all()
        users = {user.id: user for user in User.query.all()}
        
        audit_logs = []
        for evidence in evidences:
            user = users.get(evidence.uploaded_by)
            audit_logs.append({
                'id': evidence.id,
                'action': 'evidence_upload',
                'description': f'Uploaded evidence file: {evidence.filename}',
                'user_email': user.email if user else None,
                'user_id': evidence.uploaded_by,
                'user_role': user.role if user else 'Investigator',
                'created_at': evidence.created_at,
                'ip_address': '192.168.1.100',  # Would come from audit table
                'user_agent': 'Mozilla/5.0...',  # Would come from audit table
                'details': {
                    'evidence_id': evidence.id,
                    'file_size': evidence.file_size,
                    'sha256_hash': evidence.sha256_hash,
                    'blockchain_tx': evidence.blockchain_tx_hash
                }
            })
        
        return audit_logs