from app import db
from app.models.user import User
from flask import current_app
import logging

logger = logging.getLogger(__name__)

class ProfileService:
    """Service class for handling user profile operations"""
    
    @staticmethod
    def get_user_profile(user_id):
        """
        Get user profile by user ID
        
        Args:
            user_id (int): The user's ID
            
        Returns:
            dict: User profile data or None if user not found
        """
        try:
            user = User.query.get(user_id)
            if not user:
                logger.warning(f"User with ID {user_id} not found")
                return None
            
            return user.to_dict()
        
        except Exception as e:
            logger.error(f"Error fetching user profile for ID {user_id}: {str(e)}")
            return None
    
    @staticmethod
    def update_user_profile(user_id, profile_data):
        """
        Update user profile
        
        Args:
            user_id (int): The user's ID
            profile_data (dict): Profile data to update
            
        Returns:
            tuple: (success: bool, message: str, user_data: dict)
        """
        try:
            user = User.query.get(user_id)
            if not user:
                return False, "User not found", None
            
            # Validate required fields
            validation_result = ProfileService._validate_profile_data(profile_data)
            if not validation_result['valid']:
                return False, validation_result['message'], None
            
            # Update user profile
            user.update_profile(profile_data)
            db.session.commit()
            
            logger.info(f"Profile updated for user ID {user_id}")
            return True, "Profile updated successfully", user.to_dict()
        
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error updating profile for user ID {user_id}: {str(e)}")
            return False, "An error occurred while updating profile", None
    
    @staticmethod
    def _validate_profile_data(data):
        """
        Validate profile data
        
        Args:
            data (dict): Profile data to validate
            
        Returns:
            dict: Validation result with 'valid' and 'message' keys
        """
        if not isinstance(data, dict):
            return {'valid': False, 'message': 'Invalid data format'}
        
        # Validate email format if provided
        if 'email' in data:
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, data['email']):
                return {'valid': False, 'message': 'Invalid email format'}
        
        # Validate phone format if provided
        if 'phone' in data and data['phone']:
            import re
            phone_pattern = r'^[\+]?[1-9][\d]{0,15}$'
            if not re.match(phone_pattern, data['phone'].replace('-', '').replace(' ', '').replace('(', '').replace(')', '')):
                return {'valid': False, 'message': 'Invalid phone number format'}
        
        # Validate name length
        if 'name' in data and data['name'] and len(data['name']) > 100:
            return {'valid': False, 'message': 'Name must be less than 100 characters'}
        
        # Validate department length
        if 'department' in data and data['department'] and len(data['department']) > 100:
            return {'valid': False, 'message': 'Department must be less than 100 characters'}
        
        # Validate badge number length
        if 'badge_number' in data and data['badge_number'] and len(data['badge_number']) > 50:
            return {'valid': False, 'message': 'Badge number must be less than 50 characters'}
        
        return {'valid': True, 'message': 'Valid data'}
    
    @staticmethod
    def get_user_statistics(user_id):
        """
        Get user statistics (cases, evidence, etc.)
        
        Args:
            user_id (int): The user's ID
            
        Returns:
            dict: User statistics
        """
        try:
            # This would be expanded based on your actual models
            # For now, returning mock data
            return {
                'total_cases': 0,
                'active_cases': 0,
                'evidence_files': 0,
                'last_activity': None
            }
        
        except Exception as e:
            logger.error(f"Error fetching statistics for user ID {user_id}: {str(e)}")
            return {
                'total_cases': 0,
                'active_cases': 0,
                'evidence_files': 0,
                'last_activity': None
            }
