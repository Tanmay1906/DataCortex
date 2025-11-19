from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.services.auth_services import AuthService
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
            
        # Create user with all provided data
        user_data = {
            'email': data['email'],
            'password': data['password'],
            'username': data.get('email'),  # Using email as username
            'role': data.get('role', 'investigator'),
            'department': data.get('department'),
            'name': data.get('name'),
            'phone': data.get('phone')
        }
        
        user = AuthService.register_user(**user_data)
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            "message": "Registration successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            }
        }), 201
        
    except ValueError as ve:
        # Handle known errors like duplicate email
        return jsonify({"error": str(ve)}), 409
    except Exception as e:
        import traceback
        print("REGISTER ERROR:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data.get('email') or not data.get('password'):
        return jsonify({"error": "Email and password are required"}), 400
    
    try:
        user = AuthService.authenticate_user(data['email'], data['password'])
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401  # <-- FIXED
        
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('current_password') or not data.get('new_password'):
            return jsonify({"error": "Current password and new password are required"}), 400
        
        # Get current user
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Verify current password
        if not AuthService.verify_password(data['current_password'], user.password_hash):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        # Update password
        success = AuthService.update_password(user.id, data['new_password'])
        
        if success:
            return jsonify({"message": "Password changed successfully"}), 200
        else:
            return jsonify({"error": "Failed to update password"}), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500