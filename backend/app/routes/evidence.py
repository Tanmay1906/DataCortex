from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.evidence_services import EvidenceService
from app.services.blockchain_services import BlockchainService
from app.services.chain_of_custody_services import ChainOfCustodyService
from app.models.evidence import Evidence
from app.models.case import Case
from app import db
from datetime import datetime, timezone, timedelta
import traceback
import os
import hashlib
from werkzeug.utils import secure_filename

# Define IST timezone
IST = timezone(timedelta(hours=5, minutes=30))

def format_datetime_for_api(dt):
    """Format datetime for API response"""
    if dt is None:
        return None
    if dt.tzinfo is None:
        dt_utc = dt.replace(tzinfo=timezone.utc)
        dt_ist = dt_utc.astimezone(IST)
        return dt_ist.isoformat()
    else:
        return dt.isoformat()

evidence_bp = Blueprint('evidence', __name__)

@evidence_bp.route('/upload', methods=['POST', 'OPTIONS'])
@jwt_required()
def upload_evidence():
    print("=== UPLOAD EVIDENCE ROUTE CALLED ===")
    print(f"Request method: {request.method}")
    print(f"Request headers: {dict(request.headers)}")
    print(f"Request files: {list(request.files.keys())}")
    print(f"Request form: {dict(request.form)}")
    
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        print("Handling OPTIONS preflight request")
        return '', 200
    
    # Check JWT token before processing
    try:
        from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        print(f"Authenticated user ID: {current_user_id}")
    except Exception as jwt_error:
        print(f"JWT authentication failed: {str(jwt_error)}")
        import traceback
        traceback.print_exc()
        return jsonify({"msg": "Authentication failed", "error": str(jwt_error)}), 401
    
    try:
        # Check if file is provided
        if 'file' not in request.files:
            return jsonify({"msg": "No file provided"}), 400
        
        file = request.files['file']
        if not file or file.filename == '' or file.filename is None:
            return jsonify({"msg": "No file selected"}), 400
        
        # Get form data
        case_id = request.form.get('caseId')
        description = request.form.get('description', '')
        
        if not case_id:
            return jsonify({"msg": "Case ID is required"}), 400
        
        print(f"Checking case access for case_id: {case_id}, user_id: {current_user_id}")
        
        # Validate case exists and user has access
        case = Case.query.get(case_id)
        if not case:
            print(f"Case not found: {case_id}")
            return jsonify({"msg": "Case not found"}), 404
        
        print(f"Case found: {case.title}, uploaded_by: {case.uploaded_by}, current_user: {current_user_id}")
        
        # Check if user has access to this case (either uploaded by them or they're assigned)
        # For now, allow any authenticated user to upload evidence (this can be made more restrictive later)
        # if case.uploaded_by != current_user_id:
        #     print(f"Access denied: case.uploaded_by ({case.uploaded_by}) != current_user_id ({current_user_id})")
        #     return jsonify({"msg": "Access denied to this case"}), 403
        
        print(f"Processing file: {file.filename}, case_id: {case_id}, description: {description}")
        
        # Calculate file hash
        file_content = file.read()
        file_hash = hashlib.sha256(file_content).hexdigest()
        print(f"File hash calculated: {file_hash}")
        
        # Reset file pointer
        file.seek(0)
        
        # Create secure filename
        original_filename = file.filename
        filename = secure_filename(original_filename)
        
        # Ensure uploads directory exists
        upload_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        file_path = os.path.join(upload_dir, f"{file_hash}_{filename}")
        file.save(file_path)
        print(f"File saved to: {file_path}")
        
        # Get MIME type
        mime_type = file.content_type or 'application/octet-stream'
        
        # Try blockchain upload (with fallback)
        tx_hash = None
        gas_used = 0.0
        try:
            blockchain_service = BlockchainService()
            tx_hash, gas_used = blockchain_service.store_evidence_hash(file_hash, case_id, description)
            print(f"Blockchain transaction successful: {tx_hash}, Gas used: {gas_used}")
        except Exception as blockchain_error:
            print(f"Blockchain storage failed: {str(blockchain_error)}")
            # Create a fallback transaction hash
            tx_hash = f"fallback_{file_hash[:16]}"
            gas_used = 0.0
        
        # Store in database
        evidence_service = EvidenceService()
        evidence = evidence_service.create_evidence(
            case_id=int(case_id),
            filename=filename,
            original_name=original_filename,
            file_size=len(file_content),
            mime_type=mime_type,
            sha256_hash=file_hash,
            blockchain_tx_hash=tx_hash,
            description=description,
            uploaded_by=current_user_id,
            file_path=file_path
        )
        
        print(f"Evidence created with ID: {evidence.id}, file_path: {file_path}")
        
        # Log chain of custody for the upload
        try:
            ChainOfCustodyService.log_evidence_upload(
                evidence_id=evidence.id,
                case_id=int(case_id),
                user_id=current_user_id,
                file_hash=file_hash,
                location="Digital Evidence System"
            )
            print(f"Chain of custody logged for evidence {evidence.id}")
        except Exception as custody_error:
            print(f"Failed to log chain of custody: {str(custody_error)}")
            # Don't fail the upload if custody logging fails
        
        # Return success response
        return jsonify({
            "msg": "File uploaded successfully",
            "status": "success",
            "sha256": file_hash,
            "txHash": tx_hash,
            "gasUsed": 0.00001,  # Mock gas usage
            "evidenceId": evidence.id,
            "filename": filename,
            "size": len(file_content)
        }), 200
        
    except Exception as e:
        print(f"Error in upload route: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"msg": "Upload failed", "error": str(e)}), 500

@evidence_bp.route('/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case_evidence(case_id):
    try:
        print(f"GET /api/evidence/{case_id} called")
        current_user_id = get_jwt_identity()
        evidences = EvidenceService.get_evidence_by_case(case_id, int(current_user_id))
        
        evidence_data = []
        for evidence in evidences:
            # Log chain of custody for viewing evidence list
            try:
                ChainOfCustodyService.log_evidence_view(
                    evidence_id=evidence.id,
                    case_id=case_id,
                    user_id=current_user_id
                )
            except Exception as custody_error:
                print(f"Failed to log view custody for evidence {evidence.id}: {str(custody_error)}")
                # Don't fail the request if custody logging fails
            
            evidence_data.append({
                "id": evidence.id,
                "filename": evidence.filename,
                "originalName": getattr(evidence, 'original_name', evidence.filename),
                "size": getattr(evidence, 'file_size', 0),
                "mimeType": getattr(evidence, 'mime_type', 'application/octet-stream'),
                "sha256": evidence.sha256_hash,
                "uploadedBy": f"User #{evidence.uploaded_by}",
                "uploadedAt": format_datetime_for_api(evidence.uploaded_at),
                "blockchainTxHash": getattr(evidence, 'blockchain_tx_hash', None),
                "status": getattr(evidence, 'status', 'active'),
                "description": getattr(evidence, 'description', ''),
                "caseId": evidence.case_id
            })
        
        return jsonify(evidence_data), 200
    except Exception as e:
        print(f"Error in get_case_evidence: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": str(e)}), 400

@evidence_bp.route('/<int:evidence_id>', methods=['DELETE'])
@jwt_required()
def delete_evidence(evidence_id):
    try:
        print(f"DELETE /api/evidence/{evidence_id} called")
        current_user_id = get_jwt_identity()
        
        # For now, just mark as deleted (you might want to implement soft delete)
        evidence = Evidence.query.get_or_404(evidence_id)
        
        # Check permission
        case = Case.query.filter_by(id=evidence.case_id, uploaded_by=current_user_id).first()
        if not case and evidence.uploaded_by != current_user_id:
            return jsonify({"msg": "Permission denied"}), 403
        
        # Prevent deletion from completed cases
        if case and case.is_completed:
            return jsonify({"msg": "Cannot delete evidence from a completed case"}), 400
        
        db.session.delete(evidence)
        db.session.commit()
        
        return jsonify({"msg": "Evidence deleted successfully"}), 200
            
    except Exception as e:
        print(f"Error in delete_evidence: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@evidence_bp.route('/blockchain/case/<int:case_id>', methods=['GET'])
@jwt_required()
def get_blockchain_logs(case_id):
    try:
        print(f"GET /api/evidence/blockchain/case/{case_id} called")
        current_user_id = get_jwt_identity()
        
        # Get blockchain logs for the case
        logs = BlockchainService.get_blockchain_logs_by_case(case_id)
        
        return jsonify(logs), 200
        
    except Exception as e:
        print(f"Error in get_blockchain_logs: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@evidence_bp.route('/audit/case/<int:case_id>', methods=['GET'])
@jwt_required()
def get_audit_logs(case_id):
    try:
        print(f"GET /api/evidence/audit/case/{case_id} called")
        current_user_id = get_jwt_identity()
        
        # Get audit logs for the case
        logs = EvidenceService.get_audit_logs_by_case(case_id, int(current_user_id))
        
        audit_data = []
        for log in logs:
            audit_data.append({
                "id": log['id'],
                "action": log['action'],
                "description": log['description'],
                "userId": log['user_email'] or f"user{log['user_id']}@trm.gov",
                "userRole": log['user_role'] or "Investigator",
                "timestamp": format_datetime_for_api(log['created_at']),
                "ipAddress": log['ip_address'] or "unknown",
                "userAgent": log['user_agent'] or "Unknown Browser",
                "details": log['details'] or {}
            })
        
        return jsonify(audit_data), 200
        
    except Exception as e:
        print(f"Error in get_audit_logs: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@evidence_bp.route('/file/<int:evidence_id>', methods=['GET'])
@jwt_required()
def download_evidence(evidence_id):
    try:
        current_user_id = get_jwt_identity()
        evidence = EvidenceService.get_evidence_file(evidence_id, int(current_user_id))
        
        # Check if this is a preview request (no download parameter)
        is_download = request.args.get('download', 'false').lower() == 'true'
        
        # Log chain of custody for the access
        action_type = 'downloaded' if is_download else 'viewed'
        try:
            ChainOfCustodyService.log_evidence_download(
                evidence_id=evidence.id,
                case_id=evidence.case_id,
                user_id=current_user_id,
                tool_used="Web Browser"
            )
            print(f"Evidence {action_type} logged in chain of custody for evidence {evidence.id}")
        except Exception as custody_error:
            print(f"Failed to log {action_type} custody: {str(custody_error)}")
            # Don't fail the request if custody logging fails
        
        # For preview, don't force download; for download, force attachment
        return send_file(
            evidence.file_path, 
            as_attachment=is_download, 
            download_name=evidence.filename if is_download else None,
            mimetype=evidence.mime_type
        )
    except PermissionError as e:
        print(f"Permission error for evidence {evidence_id}: {str(e)}")
        return jsonify({"msg": str(e)}), 403
    except Exception as e:
        print(f"Error accessing evidence {evidence_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"msg": str(e)}), 400