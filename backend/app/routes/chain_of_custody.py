from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.evidence import Evidence
from app.models.case import Case
from app.models.user import User
from app import db
import logging

# Use try-except to handle dynamic imports for better error handling
try:
    from app.models.chain_of_custody import ChainOfCustody, CustodyAction
    from app.services.chain_of_custody_services import ChainOfCustodyService
except ImportError as e:
    # Fallback to dynamic imports if static imports fail
    import importlib
    
    def _get_chain_of_custody_models():
        """Dynamically import chain of custody models"""
        module = importlib.import_module('app.models.chain_of_custody')
        return module.ChainOfCustody, module.CustodyAction

    def _get_chain_of_custody_service():
        """Dynamically import chain of custody service"""
        module = importlib.import_module('app.services.chain_of_custody_services')
        return module.ChainOfCustodyService

    ChainOfCustody, CustodyAction = _get_chain_of_custody_models()
    ChainOfCustodyService = _get_chain_of_custody_service()

# Create blueprint
chain_of_custody_bp = Blueprint('chain_of_custody', __name__)

@chain_of_custody_bp.route('/api/evidence/<int:evidence_id>/custody-chain', methods=['GET'])
@jwt_required()
def get_evidence_custody_chain(evidence_id):
    """Get complete chain of custody for specific evidence"""
    try:
        user_id = get_jwt_identity()
        case_id = request.args.get('case_id', type=int)
        
        # Verify evidence exists and user has access
        evidence = Evidence.query.get_or_404(evidence_id)
        if case_id and evidence.case_id != case_id:
            return jsonify({'error': 'Evidence does not belong to specified case'}), 400
        
        # Get custody chain
        custody_chain = ChainOfCustodyService.get_custody_chain(evidence_id, case_id)
        
        # Log this access
        ChainOfCustodyService.log_evidence_view(evidence_id, evidence.case_id, user_id)
        
        # Format response
        chain_data = []
        for record in custody_chain:
            chain_data.append({
                'id': record.id,
                'action': record.action,
                'action_description': record.action_description,
                'performed_by': record.performer_name,
                'transferred_from': record.from_user_name,
                'transferred_to': record.to_user_name,
                'location': record.location,
                'ip_address': record.ip_address,
                'hash_verified': record.hash_verified,
                'hash_value': record.hash_value,
                'integrity_status': record.integrity_status,
                'condition_before': record.condition_before,
                'condition_after': record.condition_after,
                'tool_used': record.tool_used,
                'tool_version': record.tool_version,
                'authorization': record.authorization,
                'witness': record.witness,
                'documentation_ref': record.documentation_ref,
                'action_timestamp': record.action_timestamp.isoformat(),
                'created_at': record.created_at.isoformat() if record.created_at else None
            })
        
        # Get custody summary
        summary = ChainOfCustodyService.get_custody_summary(evidence_id, case_id)
        
        return jsonify({
            'evidence_id': evidence_id,
            'case_id': evidence.case_id,
            'evidence_filename': evidence.filename,
            'custody_chain': chain_data,
            'summary': summary
        })
        
    except Exception as e:
        current_app.logger.error(f"Error getting custody chain for evidence {evidence_id}: {str(e)}")
        return jsonify({'error': 'Failed to retrieve custody chain'}), 500

@chain_of_custody_bp.route('/api/cases/<int:case_id>/custody-chain', methods=['GET'])
@jwt_required()
def get_case_custody_chain(case_id):
    """Get complete chain of custody for all evidence in a case"""
    try:
        user_id = get_jwt_identity()
        
        # Verify case exists
        case = Case.query.get_or_404(case_id)
        
        # Get custody chain for all evidence in case
        custody_records = ChainOfCustodyService.get_case_custody_chain(case_id)
        
        # Group by evidence
        evidence_chains = {}
        for record in custody_records:
            evidence_id = record.evidence_id
            if evidence_id not in evidence_chains:
                evidence_chains[evidence_id] = {
                    'evidence': {
                        'id': record.evidence.id,
                        'filename': record.evidence.filename,
                        'file_size': record.evidence.file_size,
                        'mime_type': record.evidence.mime_type,
                        'sha256_hash': record.evidence.sha256_hash
                    },
                    'custody_records': [],
                    'summary': None
                }
            
            evidence_chains[evidence_id]['custody_records'].append({
                'id': record.id,
                'action': record.action,
                'action_description': record.action_description,
                'performed_by': record.performer_name,
                'transferred_from': record.from_user_name,
                'transferred_to': record.to_user_name,
                'location': record.location,
                'hash_verified': record.hash_verified,
                'integrity_status': record.integrity_status,
                'tool_used': record.tool_used,
                'action_timestamp': record.action_timestamp.isoformat()
            })
        
        # Add summaries for each evidence
        for evidence_id in evidence_chains:
            evidence_chains[evidence_id]['summary'] = ChainOfCustodyService.get_custody_summary(evidence_id, case_id)
        
        return jsonify({
            'case_id': case_id,
            'case_title': case.title,
            'evidence_count': len(evidence_chains),
            'evidence_chains': evidence_chains
        })
        
    except Exception as e:
        current_app.logger.error(f"Error getting custody chain for case {case_id}: {str(e)}")
        return jsonify({'error': 'Failed to retrieve case custody chain'}), 500

@chain_of_custody_bp.route('/api/evidence/<int:evidence_id>/custody-action', methods=['POST'])
@jwt_required()
def log_custody_action(evidence_id):
    """Log a new custody action for evidence"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        action = data.get('action')
        if not action:
            return jsonify({'error': 'Action is required'}), 400
        
        # Verify evidence exists
        evidence = Evidence.query.get_or_404(evidence_id)
        case_id = evidence.case_id
        
        # Prepare custody action data
        custody_data = {
            'action_description': data.get('action_description'),
            'location': data.get('location'),
            'tool_used': data.get('tool_used'),
            'tool_version': data.get('tool_version'),
            'authorization': data.get('authorization'),
            'witness': data.get('witness'),
            'documentation_ref': data.get('documentation_ref'),
            'condition_before': data.get('condition_before'),
            'condition_after': data.get('condition_after')
        }
        
        # Handle specific action types
        if action == CustodyAction.TRANSFERRED:
            transferred_to = data.get('transferred_to')
            if not transferred_to:
                return jsonify({'error': 'transferred_to is required for transfer actions'}), 400
            
            # Verify target user exists
            target_user = User.query.get(transferred_to)
            if not target_user:
                return jsonify({'error': 'Target user not found'}), 400
            
            custody_record = ChainOfCustodyService.log_evidence_transfer(
                evidence_id, case_id, user_id, transferred_to, 
                reason=data.get('reason')
            )
        elif action == CustodyAction.ANALYZED:
            custody_record = ChainOfCustodyService.log_evidence_analysis(
                evidence_id, case_id, user_id,
                tool_used=data.get('tool_used'),
                tool_version=data.get('tool_version'),
                findings=data.get('findings')
            )
        elif action == CustodyAction.VERIFIED:
            computed_hash = data.get('computed_hash')
            verification_result = data.get('verification_result', True)
            
            custody_record = ChainOfCustodyService.log_hash_verification(
                evidence_id, case_id, user_id, computed_hash, verification_result
            )
        else:
            # Generic custody action
            custody_record = ChainOfCustodyService.log_custody_action(
                evidence_id, case_id, user_id, action, **custody_data
            )
        
        return jsonify({
            'message': 'Custody action logged successfully',
            'custody_record_id': custody_record.id,
            'action': custody_record.action,
            'timestamp': custody_record.action_timestamp.isoformat()
        })
        
    except Exception as e:
        current_app.logger.error(f"Error logging custody action for evidence {evidence_id}: {str(e)}")
        return jsonify({'error': 'Failed to log custody action'}), 500

@chain_of_custody_bp.route('/api/evidence/<int:evidence_id>/integrity', methods=['GET'])
@jwt_required()
def verify_evidence_integrity(evidence_id):
    """Verify evidence integrity based on custody chain"""
    try:
        case_id = request.args.get('case_id', type=int)
        
        # Verify evidence exists
        evidence = Evidence.query.get_or_404(evidence_id)
        if case_id and evidence.case_id != case_id:
            return jsonify({'error': 'Evidence does not belong to specified case'}), 400
        
        # Verify integrity
        integrity_result = ChainOfCustodyService.verify_evidence_integrity(evidence_id, case_id)
        
        return jsonify({
            'evidence_id': evidence_id,
            'integrity': integrity_result
        })
        
    except Exception as e:
        current_app.logger.error(f"Error verifying integrity for evidence {evidence_id}: {str(e)}")
        return jsonify({'error': 'Failed to verify evidence integrity'}), 500

@chain_of_custody_bp.route('/api/custody-actions', methods=['GET'])
@jwt_required()
def get_custody_actions():
    """Get list of available custody actions"""
    return jsonify({
        'actions': [
            {'value': CustodyAction.COLLECTED, 'label': 'Collected', 'description': 'Evidence collected from source'},
            {'value': CustodyAction.UPLOADED, 'label': 'Uploaded', 'description': 'Evidence uploaded to system'},
            {'value': CustodyAction.VIEWED, 'label': 'Viewed', 'description': 'Evidence viewed by user'},
            {'value': CustodyAction.DOWNLOADED, 'label': 'Downloaded', 'description': 'Evidence downloaded by user'},
            {'value': CustodyAction.ANALYZED, 'label': 'Analyzed', 'description': 'Evidence analyzed with tools'},
            {'value': CustodyAction.TRANSFERRED, 'label': 'Transferred', 'description': 'Evidence custody transferred'},
            {'value': CustodyAction.COPIED, 'label': 'Copied', 'description': 'Evidence copied'},
            {'value': CustodyAction.MOVED, 'label': 'Moved', 'description': 'Evidence moved to new location'},
            {'value': CustodyAction.VERIFIED, 'label': 'Verified', 'description': 'Evidence integrity verified'},
            {'value': CustodyAction.REVIEWED, 'label': 'Reviewed', 'description': 'Evidence reviewed for case'},
            {'value': CustodyAction.ARCHIVED, 'label': 'Archived', 'description': 'Evidence archived for storage'},
            {'value': CustodyAction.SEALED, 'label': 'Sealed', 'description': 'Evidence sealed for court'},
            {'value': CustodyAction.UNSEALED, 'label': 'Unsealed', 'description': 'Evidence unsealed from court'}
        ]
    })
