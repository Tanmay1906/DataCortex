from app.models.user import User
from app import db

class AuthService:
    @staticmethod
    def register_user(username, email, password, role='investigator', department=None, name=None, phone=None):
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            raise ValueError('Email already exists')
        
        # Only check username if it's different from email and not None
        if username and username != email and User.query.filter_by(username=username).first():
            raise ValueError('Username already exists')
        
        user = User(
            username=username, 
            email=email, 
            role=role,
            department=department,
            name=name,
            phone=phone
        )
        user.password_hash = User.generate_password_hash(password)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def authenticate_user(email, password):
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return None
        return user
    
    @staticmethod
    def verify_password(password, password_hash):
        """Verify a password against a hash"""
        from werkzeug.security import check_password_hash
        return check_password_hash(password_hash, password)
    
    @staticmethod
    def update_password(user_id, new_password):
        """Update user password"""
        try:
            user = User.query.get(user_id)
            if not user:
                return False
            
            user.password_hash = User.generate_password_hash(new_password)
            db.session.commit()
            return True
        except Exception:
            db.session.rollback()
            return False