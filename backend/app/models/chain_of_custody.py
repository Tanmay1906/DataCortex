from app import db
from datetime import datetime, timezone, timedelta

# Define IST timezone (+5:30 from UTC)
IST = timezone(timedelta(hours=5, minutes=30))

def ist_now():
    """Get current time in IST"""
    return datetime.now(IST)

class ChainOfCustody(db.Model):
    __tablename__ = 'chain_of_custody'
    
    id = db.Column(db.Integer, primary_key=True)
    evidence_id = db.Column(db.Integer, db.ForeignKey('evidence.id'), nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey('cases.id'), nullable=False)
    
    # Action details
    action = db.Column(db.String(50), nullable=False)  # collected, transferred, analyzed, viewed, downloaded, etc.
    action_description = db.Column(db.Text, nullable=True)  # Detailed description of the action
    
    # Personnel information
    performed_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    transferred_from = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # For transfer actions
    transferred_to = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # For transfer actions
    
    # Location and environment
    location = db.Column(db.String(255), nullable=True)  # Physical or logical location
    ip_address = db.Column(db.String(45), nullable=True)  # IPv4 or IPv6
    user_agent = db.Column(db.Text, nullable=True)  # Browser/client information
    
    # Integrity verification
    hash_verified = db.Column(db.Boolean, default=False)  # Whether file hash was verified
    hash_value = db.Column(db.String(64), nullable=True)  # Hash at time of action (for verification)
    integrity_status = db.Column(db.String(20), default='verified')  # verified, compromised, unknown
    
    # Evidence condition
    condition_before = db.Column(db.String(100), nullable=True)  # Condition before action
    condition_after = db.Column(db.String(100), nullable=True)  # Condition after action
    
    # Digital forensics specific
    tool_used = db.Column(db.String(100), nullable=True)  # Tool/software used for action
    tool_version = db.Column(db.String(50), nullable=True)  # Version of tool used
    
    # Legal and procedural
    authorization = db.Column(db.String(100), nullable=True)  # Legal authorization reference
    witness = db.Column(db.String(255), nullable=True)  # Witness to the action
    documentation_ref = db.Column(db.String(255), nullable=True)  # Reference to external documentation
    
    # Timestamps
    action_timestamp = db.Column(db.DateTime, default=ist_now, nullable=False)
    created_at = db.Column(db.DateTime, default=ist_now)
    updated_at = db.Column(db.DateTime, default=ist_now, onupdate=ist_now)
    
    # Relationships
    evidence = db.relationship('Evidence', backref='custody_chain', lazy=True)
    case = db.relationship('Case', backref='custody_records', lazy=True)
    performer = db.relationship('User', foreign_keys=[performed_by], backref='performed_custody_actions', lazy=True)
    from_user = db.relationship('User', foreign_keys=[transferred_from], backref='custody_transfers_from', lazy=True)
    to_user = db.relationship('User', foreign_keys=[transferred_to], backref='custody_transfers_to', lazy=True)
    
    def __repr__(self):
        return f'<ChainOfCustody {self.action} on Evidence {self.evidence_id} by User {self.performed_by}>'

    @property
    def performer_name(self):
        return self.performer.email if self.performer else None
    
    @property
    def from_user_name(self):
        return self.from_user.email if self.from_user else None
    
    @property
    def to_user_name(self):
        return self.to_user.email if self.to_user else None

# Custody action constants
class CustodyAction:
    COLLECTED = 'collected'
    UPLOADED = 'uploaded'
    VIEWED = 'viewed'
    DOWNLOADED = 'downloaded'
    ANALYZED = 'analyzed'
    TRANSFERRED = 'transferred'
    COPIED = 'copied'
    MOVED = 'moved'
    DELETED = 'deleted'
    ARCHIVED = 'archived'
    VERIFIED = 'verified'
    MODIFIED = 'modified'
    SEALED = 'sealed'
    UNSEALED = 'unsealed'
    REVIEWED = 'reviewed'
