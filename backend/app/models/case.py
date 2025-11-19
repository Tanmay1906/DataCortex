from app import db
from datetime import datetime, timezone, timedelta
import re

# Define IST timezone (+5:30 from UTC)
IST = timezone(timedelta(hours=5, minutes=30))

def ist_now():
    """Get current time in IST"""
    return datetime.now(IST)

class Case(db.Model):
    __tablename__ = 'cases'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='low')  # Changed default from 'open' to 'low'
    case_number = db.Column(db.String(50), nullable=False, unique=True)
    priority = db.Column(db.String(20), nullable=True)
    lead_investigator = db.Column(db.String(100), nullable=True)
    evidence_type = db.Column(db.String(50), nullable=True)
    uploaded_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=ist_now)
    updated_at = db.Column(db.DateTime, default=ist_now, onupdate=ist_now)
    
    # Case completion fields
    is_completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    completed_by_name = db.Column(db.String(100), nullable=True)
    completed_by_position = db.Column(db.String(100), nullable=True)
    completion_authorization = db.Column(db.String(200), nullable=True)
    completion_notes = db.Column(db.Text, nullable=True)
    
    evidences = db.relationship('Evidence', backref='case', lazy=True, cascade='all, delete-orphan')
    
    @staticmethod
    def generate_case_number():
        """Generate a unique case number in the format TRM-YYYY-NNNN"""
        current_year = datetime.now().year
        
        # Get the highest case number for the current year
        highest_case = db.session.query(Case).filter(
            Case.case_number.like(f'TRM-{current_year}-%')
        ).order_by(Case.case_number.desc()).first()
        
        if highest_case:
            # Extract the sequence number from the case number
            match = re.search(r'TRM-\d{4}-(\d{4})', highest_case.case_number)
            if match:
                sequence = int(match.group(1)) + 1
            else:
                sequence = 1
        else:
            sequence = 1
        
        return f"TRM-{current_year}-{sequence:04d}"
    
    @staticmethod
    def validate_case_number(case_number):
        """Validate case number format (TRM-YYYY-NNNN)"""
        pattern = r'^TRM-\d{4}-\d{4}$'
        return bool(re.match(pattern, case_number))
    
    def mark_complete(self, completed_by_name, completed_by_position, authorization, notes=None):
        """Mark the case as complete with authorization details"""
        self.is_completed = True
        self.completed_at = ist_now()
        self.completed_by_name = completed_by_name
        self.completed_by_position = completed_by_position
        self.completion_authorization = authorization
        self.completion_notes = notes
        self.status = 'completed'  # Update status to completed
        self.updated_at = ist_now()
    
    def __repr__(self):
        return f'<Case {self.case_number}: {self.title}>'