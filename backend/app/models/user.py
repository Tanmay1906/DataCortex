from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='investigator')
    
    # Profile fields
    name = db.Column(db.String(100), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    badge_number = db.Column(db.String(50), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    username = db.Column(db.String(80), nullable=True)
    
    # Additional profile fields
    position = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime, nullable=True)
    
    @staticmethod
    def generate_password_hash(password):
        return generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self, include_sensitive=False):
        """Convert user object to dictionary"""
        data = {
            'id': self.id,
            'email': self.email,
            'role': self.role,
            'name': self.name,
            'department': self.department,
            'badge_number': self.badge_number,
            'phone': self.phone,
            'username': self.username,
            'position': self.position,
            'location': self.location,
            'bio': self.bio,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }
        
        return data
    
    def update_profile(self, data):
        """Update user profile with provided data"""
        allowed_fields = ['name', 'department', 'badge_number', 'phone', 
                         'username', 'position', 'location', 'bio']
        
        for field in allowed_fields:
            if field in data:
                setattr(self, field, data[field])
        
        self.updated_at = datetime.utcnow()
    
    def __repr__(self):
        return f'<User {self.email}>'