from app import db
from datetime import datetime, timezone, timedelta

# Define IST timezone (+5:30 from UTC)
IST = timezone(timedelta(hours=5, minutes=30))

def ist_now():
    """Get current time in IST"""
    return datetime.now(IST)

class Evidence(db.Model):
    __tablename__ = 'evidence'
    
    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    filename = db.Column(db.String(120), nullable=False)
    original_name = db.Column(db.String(255), nullable=True)  # Original filename before sanitization
    file_path = db.Column(db.String(255), nullable=True)  # Allow null initially, set after file save
    file_size = db.Column(db.BigInteger, nullable=True)  # File size in bytes
    mime_type = db.Column(db.String(100), nullable=True)  # MIME type
    sha256_hash = db.Column(db.String(64), nullable=False)
    blockchain_tx_hash = db.Column(db.String(66), nullable=True)  # Updated field name
    description = db.Column(db.Text, nullable=True)  # Evidence description
    status = db.Column(db.String(20), default='active')  # active, deleted, etc.
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=ist_now)
    created_at = db.Column(db.DateTime, default=ist_now)  # For consistency
    
    # Relationship to get uploader name
    uploader = db.relationship('User', backref='uploaded_evidence', lazy=True)
    
    @property
    def uploaded_by_name(self):
        return self.uploader.email if self.uploader else None
    
    def __repr__(self):
        return f'<Evidence {self.filename}>'