from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.cases_services import CaseService
from app.models import Case
from datetime import datetime, timezone, timedelta
import traceback

# Define IST timezone
IST = timezone(timedelta(hours=5, minutes=30))

def format_datetime_for_api(dt):
    """
    Format datetime for API response, handling both timezone-aware and naive datetimes
    """
    if dt is None:
        return None
    
    # If the datetime is naive (no timezone info), assume it's UTC from old data
    if dt.tzinfo is None:
        # Treat as UTC and convert to IST
        dt_utc = dt.replace(tzinfo=timezone.utc)
        dt_ist = dt_utc.astimezone(IST)
        return dt_ist.isoformat()
    else:
        # Already has timezone info, just return as ISO
        return dt.isoformat()

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('', methods=['POST'])
@jwt_required()
def create_case():
    try:
        data = request.get_json()
        print(f"Received case data: {data}")  # Debug logging
        
        current_user_id = get_jwt_identity()
        print(f"Creating case for user: {current_user_id}")  # Debug logging
        
        title = data.get('title')
        description = data.get('description')
        status = data.get('status', 'low')  # Default to 'low' if not provided
        case_number = data.get('caseNumber')
        priority = data.get('priority')
        lead_investigator = data.get('leadInvestigator')
        evidence_type = data.get('evidenceType')
        
        print(f"Creating case with status: {status}")  # Debug logging
        
        if not title:
            return jsonify({"msg": "Title is required"}), 400
        
        case = CaseService.create_case(
            title=title, 
            description=description,
            status=status,
            case_number=case_number,
            priority=priority,
            lead_investigator=lead_investigator,
            evidence_type=evidence_type,
            uploaded_by=int(current_user_id)
        )
        
        response_data = {
            "id": case.id,
            "title": case.title,
            "description": case.description,
            "status": case.status,
            "caseNumber": case.case_number,
            "priority": case.priority,
            "leadInvestigator": case.lead_investigator,
            "evidenceType": case.evidence_type,
            "uploaded_by": case.uploaded_by,
            "created_at": format_datetime_for_api(case.created_at),
            "is_completed": case.is_completed,
            "completed_at": format_datetime_for_api(case.completed_at),
            "completed_by_name": case.completed_by_name,
            "completed_by_position": case.completed_by_position,
            "completion_authorization": case.completion_authorization,
            "completion_notes": case.completion_notes
        }
        
        print(f"Created case response: {response_data}")  # Debug logging
        return jsonify(response_data), 201
        
    except Exception as e:
        print(f"Error in create_case: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": str(e)}), 400

@cases_bp.route('/next-case-number', methods=['GET'])
@jwt_required()
def get_next_case_number():
    """Get the next available case number for preview purposes"""
    try:
        next_case_number = CaseService.get_next_case_number()
        return jsonify({"nextCaseNumber": next_case_number}), 200
    except Exception as e:
        print(f"Error in get_next_case_number: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@cases_bp.route('', methods=['GET'])
@jwt_required()
def get_cases():
    try:
        print("GET /api/cases called")
        current_user_id = get_jwt_identity()
        print(f"Current user ID: {current_user_id}")
        
        # Pagination parameters
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Only return cases created by the current user
        cases = CaseService.get_cases_by_user(int(current_user_id))
        print(f"Found {len(cases)} cases for user {current_user_id}")
        
        return jsonify([{
            "id": case.id,
            "title": case.title,
            "description": case.description,
            "status": case.status,
            "caseNumber": case.case_number,
            "priority": case.priority,
            "leadInvestigator": case.lead_investigator,
            "evidenceType": case.evidence_type,
            "uploaded_by": case.uploaded_by,
            "created_at": format_datetime_for_api(case.created_at),
            "updated_at": format_datetime_for_api(case.updated_at),
            "evidence_count": len(case.evidences),
            "is_completed": case.is_completed,
            "completed_at": format_datetime_for_api(case.completed_at),
            "completed_by_name": case.completed_by_name,
            "completed_by_position": case.completed_by_position,
            "completion_authorization": case.completion_authorization,
            "completion_notes": case.completion_notes
        } for case in cases]), 200
    except Exception as e:
        print(f"Error in get_cases: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@cases_bp.route('/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case_by_id(case_id):
    try:
        print(f"GET /api/cases/{case_id} called")
        current_user_id = get_jwt_identity()
        print(f"User {current_user_id} requesting case {case_id}")
        
        # Get the case by ID and user
        case = CaseService.get_case_by_id(case_id, int(current_user_id))
        if not case:
            return jsonify({"msg": "Case not found or you don't have permission to view it"}), 404
        
        case_data = {
            "id": case.id,
            "title": case.title,
            "description": case.description,
            "status": case.status,
            "caseNumber": case.case_number,
            "priority": case.priority,
            "leadInvestigator": case.lead_investigator,
            "evidenceType": case.evidence_type,
            "assigned_to": case.lead_investigator,  # For backward compatibility
            "evidence_count": len(case.evidences),
            "evidenceCount": len(case.evidences),   # For backward compatibility
            "created_at": format_datetime_for_api(case.created_at),
            "updated_at": format_datetime_for_api(case.updated_at),
            "uploaded_by": case.uploaded_by,
            "is_completed": case.is_completed,
            "completed_at": format_datetime_for_api(case.completed_at),
            "completed_by_name": case.completed_by_name,
            "completed_by_position": case.completed_by_position,
            "completion_authorization": case.completion_authorization,
            "completion_notes": case.completion_notes
        }
        
        print(f"Returning case data: {case_data}")
        return jsonify(case_data), 200
        
    except Exception as e:
        print(f"Error in get_case_by_id: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@cases_bp.route('/<int:case_id>', methods=['DELETE'])
@jwt_required()
def delete_case(case_id):
    try:
        print(f"DELETE /api/cases/{case_id} called")
        current_user_id = get_jwt_identity()
        print(f"User {current_user_id} attempting to delete case {case_id}")
        
        # Only allow deletion if the case belongs to the current user
        success = CaseService.delete_case(case_id, int(current_user_id))
        if success:
            return jsonify({"msg": "Case deleted successfully"}), 200
        else:
            return jsonify({"msg": "Case not found or you don't have permission to delete it"}), 404
            
    except Exception as e:
        print(f"Error in delete_case: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@cases_bp.route('/<int:case_id>', methods=['PUT'])
@jwt_required()
def update_case(case_id):
    try:
        print(f"PUT /api/cases/{case_id} called")
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        print(f"User {current_user_id} attempting to update case {case_id}")
        print(f"Update data: {data}")
        
        case = CaseService.update_case(case_id, data, int(current_user_id))
        if not case:
            return jsonify({"msg": "Case not found or you don't have permission to update it"}), 404
        
        return jsonify({
            "msg": "Case updated successfully",
            "case": {
                "id": case.id,
                "title": case.title,
                "description": case.description,
                "status": case.status,
                "caseNumber": case.case_number,
                "priority": case.priority,
                "leadInvestigator": case.lead_investigator,
                "evidenceType": case.evidence_type,
                "updated_at": format_datetime_for_api(case.updated_at),
                "is_completed": case.is_completed
            }
        }), 200
        
    except ValueError as ve:
        return jsonify({"msg": str(ve)}), 400
    except Exception as e:
        print(f"Error in update_case: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@cases_bp.route('/<int:case_id>/complete', methods=['POST'])
@jwt_required()
def complete_case(case_id):
    try:
        print(f"POST /api/cases/{case_id}/complete called")
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        completed_by_name = data.get('completedByName')
        completed_by_position = data.get('completedByPosition') 
        authorization = data.get('authorization')
        notes = data.get('notes')
        
        print(f"User {current_user_id} attempting to complete case {case_id}")
        print(f"Completion data: {data}")
        
        if not completed_by_name or not completed_by_position or not authorization:
            return jsonify({"msg": "Name, position, and authorization are required"}), 400
        
        case = CaseService.complete_case(
            case_id=case_id,
            completed_by_name=completed_by_name,
            completed_by_position=completed_by_position,
            authorization=authorization,
            notes=notes,
            user_id=int(current_user_id)
        )
        
        if not case:
            return jsonify({"msg": "Case not found, already completed, or you don't have permission"}), 404
        
        return jsonify({
            "msg": "Case marked as complete successfully",
            "case": {
                "id": case.id,
                "title": case.title,
                "case_number": case.case_number,
                "status": case.status,
                "is_completed": case.is_completed,
                "completed_at": format_datetime_for_api(case.completed_at),
                "completed_by_name": case.completed_by_name,
                "completed_by_position": case.completed_by_position,
                "completion_authorization": case.completion_authorization,
                "completion_notes": case.completion_notes
            }
        }), 200
        
    except ValueError as ve:
        return jsonify({"msg": str(ve)}), 400
    except Exception as e:
        print(f"Error in complete_case: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"msg": "Internal server error"}), 500

@cases_bp.route('/cases', methods=['GET'])
def get_all_cases():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    cases = Case.query.paginate(page, per_page, error_out=False)
    return jsonify([case.to_dict() for case in cases.items])