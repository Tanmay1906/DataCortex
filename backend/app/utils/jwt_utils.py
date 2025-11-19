from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from functools import wraps
from flask import jsonify
from app.models.user import User

def jwt_required(fn):
    """JWT required decorator for any authenticated user"""
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        return fn(*args, **kwargs)
    return wrapper

def jwt_required_with_role(role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            current_user = get_jwt_identity()
            # In a real app, you would check the user's role from the database
            if current_user.get('role') != role:
                return jsonify({"msg": "Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def get_current_user():
    """Get current user from JWT token"""
    try:
        user_id = get_jwt_identity()
        if user_id:
            # Handle both string and integer user IDs
            if isinstance(user_id, str):
                try:
                    user_id = int(user_id)
                except ValueError:
                    return None
            return User.query.get(user_id)
        return None
    except Exception as e:
        print(f"Error getting current user: {e}")
        return None