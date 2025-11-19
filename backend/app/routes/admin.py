from flask import Blueprint, request, jsonify
from app.utils.jwt_utils import jwt_required, get_current_user
from app.services.profile_services import ProfileService
import logging

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/profile', methods=['GET'])
@jwt_required
def get_profile():
    """
    Get current user's profile
    
    Returns:
        JSON response with user profile data
    """
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        profile_data = ProfileService.get_user_profile(current_user.id)
        if not profile_data:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Get user statistics
        stats = ProfileService.get_user_statistics(current_user.id)
        profile_data['statistics'] = stats
        
        return jsonify({
            'success': True,
            'data': profile_data,
            'message': 'Profile retrieved successfully'
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_profile: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching profile'
        }), 500

@admin_bp.route('/profile', methods=['POST'])
@jwt_required
def update_profile():
    """
    Update current user's profile
    
    Returns:
        JSON response with updated profile data
    """
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # Update profile
        success, message, updated_data = ProfileService.update_user_profile(
            current_user.id, data
        )
        
        if not success:
            return jsonify({
                'success': False,
                'error': message
            }), 400
        
        return jsonify({
            'success': True,
            'data': updated_data,
            'message': message
        }), 200
    
    except Exception as e:
        logger.error(f"Error in update_profile: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while updating profile'
        }), 500

@admin_bp.route('/settings', methods=['GET'])
@jwt_required
def get_settings():
    """
    Get user settings
    
    Returns:
        JSON response with user settings
    """
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        # Mock settings data - extend based on your needs
        settings = {
            'notifications': {
                'email_notifications': True,
                'case_updates': True,
                'evidence_alerts': True,
                'system_notifications': False
            },
            'security': {
                'two_factor_enabled': False,
                'session_timeout': 30,
                'password_last_changed': None
            },
            'preferences': {
                'theme': 'dark',
                'language': 'en',
                'timezone': 'UTC',
                'date_format': 'MM/DD/YYYY'
            },
            'privacy': {
                'profile_visibility': 'team',
                'activity_tracking': True,
                'data_retention': 365
            }
        }
        
        return jsonify({
            'success': True,
            'data': settings,
            'message': 'Settings retrieved successfully'
        }), 200
    
    except Exception as e:
        logger.error(f"Error in get_settings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while fetching settings'
        }), 500

@admin_bp.route('/settings', methods=['POST'])
@jwt_required
def update_settings():
    """
    Update user settings
    
    Returns:
        JSON response with updated settings
    """
    try:
        current_user = get_current_user()
        if not current_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400
        
        # For now, just return the received data
        # In a real implementation, you'd save this to a settings table
        return jsonify({
            'success': True,
            'data': data,
            'message': 'Settings updated successfully'
        }), 200
    
    except Exception as e:
        logger.error(f"Error in update_settings: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'An error occurred while updating settings'
        }), 500
