from app.models.case import Case
from app import db
from datetime import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
import logging

# Set up logging
logger = logging.getLogger(__name__)

class CaseService:
    @staticmethod
    def create_case(title, description=None, status='low', case_number=None, priority=None, lead_investigator=None, evidence_type=None, uploaded_by=None):
        print(f"CaseService.create_case called with status: {status}")  # Debug logging
        
        if not uploaded_by:
            raise ValueError("uploaded_by is required")
        
        # Generate unique case number if not provided
        if not case_number:
            case_number = Case.generate_case_number()
        
        # Validate case number format if provided
        if case_number and not Case.validate_case_number(case_number):
            raise ValueError(f"Invalid case number format. Expected format: TRM-YYYY-NNNN, got: {case_number}")
        
        max_retries = 5
        retry_count = 0
        
        while retry_count < max_retries:
            try:
                case = Case(
                    title=title,
                    description=description,
                    status=status,
                    case_number=case_number,
                    priority=priority,
                    lead_investigator=lead_investigator,
                    evidence_type=evidence_type,
                    uploaded_by=uploaded_by
                )
                db.session.add(case)
                db.session.commit()
                
                print(f"Case created with case_number: {case.case_number} and status: {case.status}")  # Debug logging
                return case
                
            except IntegrityError as e:
                db.session.rollback()
                if "case_number" in str(e) or "UNIQUE constraint failed" in str(e):
                    # Case number conflict, generate a new one
                    retry_count += 1
                    if retry_count < max_retries:
                        case_number = Case.generate_case_number()
                        logger.warning(f"Case number conflict, retrying with new number: {case_number}")
                        continue
                    else:
                        raise ValueError("Unable to generate unique case number after multiple attempts")
                else:
                    # Some other integrity error, re-raise
                    raise e
            except Exception as e:
                db.session.rollback()
                raise e
        
        raise ValueError("Failed to create case after maximum retry attempts")
    
    @staticmethod
    def get_all_cases():
        """Get all cases - only for admin use, regular users should use get_cases_by_user"""
        return Case.query.order_by(Case.created_at.desc()).all()
    
    @staticmethod
    def get_cases_by_user(user_id):
        """Get cases created by a specific user"""
        return Case.query.filter_by(uploaded_by=user_id).order_by(Case.created_at.desc()).all()
    
    @staticmethod
    def get_case_by_id(case_id, user_id=None):
        """Get a case by ID, optionally filtered by user"""
        if user_id:
            # Only return the case if it belongs to the user
            return Case.query.filter_by(id=case_id, uploaded_by=user_id).first()
        return Case.query.get_or_404(case_id)
    
    @staticmethod
    def get_case_by_number(case_number, user_id=None):
        """Get a case by case number, optionally filtered by user"""
        query = Case.query.filter_by(case_number=case_number)
        if user_id:
            query = query.filter_by(uploaded_by=user_id)
        return query.first()
    
    @staticmethod
    def delete_case(case_id, user_id=None):
        try:
            query = Case.query.filter_by(id=case_id)
            if user_id:
                # Only allow deletion if the case belongs to the user
                query = query.filter_by(uploaded_by=user_id)
            
            case = query.first()
            if case:
                # Prevent deletion of completed cases
                if case.is_completed:
                    logger.error(f"Cannot delete completed case {case_id}")
                    raise ValueError("Cannot delete a completed case")
                
                print(f"Deleting case: {case.title} (Case Number: {case.case_number})")
                db.session.delete(case)
                db.session.commit()
                print(f"Case {case_id} deleted successfully")
                return True
            else:
                print(f"Case {case_id} not found or user {user_id} doesn't have permission")
                return False
        except Exception as e:
            print(f"Error deleting case {case_id}: {str(e)}")
            db.session.rollback()
            raise e
    
    @staticmethod
    def update_case(case_id, update_data, user_id=None):
        """Update a case with validation for completed cases"""
        try:
            query = Case.query.filter_by(id=case_id)
            if user_id:
                query = query.filter_by(uploaded_by=user_id)
            
            case = query.first()
            if not case:
                logger.error(f"Case {case_id} not found or user {user_id} doesn't have permission")
                return None
            
            # Prevent editing of completed cases
            if case.is_completed:
                logger.error(f"Cannot edit completed case {case_id}")
                raise ValueError("Cannot edit a completed case")
            
            # Update case fields
            for field, value in update_data.items():
                if hasattr(case, field) and field not in ['id', 'case_number', 'created_at', 'uploaded_by']:
                    setattr(case, field, value)
            
            case.updated_at = datetime.now()
            db.session.commit()
            logger.info(f"Case {case_id} updated successfully")
            return case
            
        except Exception as e:
            logger.error(f"Error updating case {case_id}: {str(e)}")
            db.session.rollback()
            raise e
    
    @staticmethod
    def get_next_case_number():
        """Get the next available case number for preview purposes"""
        return Case.generate_case_number()
    
    @staticmethod
    def complete_case(case_id, completed_by_name, completed_by_position, authorization, notes=None, user_id=None):
        """Mark a case as complete with authorization details"""
        try:
            query = Case.query.filter_by(id=case_id)
            if user_id:
                query = query.filter_by(uploaded_by=user_id)
            
            case = query.first()
            if not case:
                logger.error(f"Case {case_id} not found or user {user_id} doesn't have permission")
                return None
            
            if case.is_completed:
                logger.warning(f"Case {case_id} is already completed")
                return None
            
            # Validate required fields
            if not completed_by_name or not completed_by_position or not authorization:
                raise ValueError("Name, position, and authorization are required to complete a case")
            
            case.mark_complete(
                completed_by_name=completed_by_name,
                completed_by_position=completed_by_position,
                authorization=authorization,
                notes=notes
            )
            
            db.session.commit()
            logger.info(f"Case {case_id} marked as complete by {completed_by_name}")
            return case
            
        except Exception as e:
            logger.error(f"Error completing case {case_id}: {str(e)}")
            db.session.rollback()
            raise e

    @staticmethod
    def get_all_cases_with_users():
        """Get all cases with associated user information"""
        return db.session.query(Case).options(joinedload(Case.user)).order_by(Case.created_at.desc()).all()