from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.case import Case
from app.models.evidence import Evidence
from app.models.user import User
from app import db
from datetime import datetime, timedelta, timezone

# Import the datetime formatting function from cases routes
from app.routes.cases import format_datetime_for_api

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats')
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    user_id = int(user_id)
    
    # Filter stats by user's own data
    stats = {
        'active_cases': Case.query.filter_by(status='active', uploaded_by=user_id).count(),
        'total_evidence': Evidence.query.filter_by(uploaded_by=user_id).count(),
        'blockchain_txs': Evidence.query.filter_by(uploaded_by=user_id).filter(Evidence.blockchain_tx_hash.isnot(None)).count(),
        'blockchain_status': 'connected'  # Check Ganache connection in real implementation
    }
    return jsonify(stats)

@dashboard_bp.route('/cases')
@jwt_required()
def get_recent_cases():
    user_id = get_jwt_identity()
    user_id = int(user_id)
    
    # Only show user's own cases
    cases = Case.query.filter_by(uploaded_by=user_id).order_by(Case.updated_at.desc()).limit(5).all()
    return jsonify([{
        'id': case.id,
        'title': case.title,
        'status': case.status,
        'updated_at': format_datetime_for_api(case.updated_at),
        'evidence_count': len(case.evidences)
    } for case in cases])

@dashboard_bp.route('/activity')
@jwt_required()
def get_recent_activity():
    user_id = get_jwt_identity()
    user_id = int(user_id)
    
    # Get evidence uploads by the user in last 48 hours
    recent_evidence = Evidence.query.filter_by(uploaded_by=user_id).filter(
        Evidence.uploaded_at > datetime.utcnow() - timedelta(hours=48)
    ).order_by(Evidence.uploaded_at.desc()).limit(15).all()
    
    # Get case updates for user's cases in last 48 hours
    recent_cases = Case.query.filter_by(uploaded_by=user_id).filter(
        Case.updated_at > datetime.utcnow() - timedelta(hours=48)
    ).order_by(Case.updated_at.desc()).limit(10).all()
    
    activities = []
    
    for evidence in recent_evidence:
        uploader = User.query.get(evidence.uploaded_by)
        activities.append({
            'type': 'evidence',
            'id': evidence.id,
            'filename': evidence.filename,
            'action': 'uploaded',
            'by': uploader.username if uploader else 'System',
            'timestamp': format_datetime_for_api(evidence.uploaded_at),
            'case_id': evidence.case_id,
            'tx_hash': evidence.blockchain_tx_hash
        })
    
    for case in recent_cases:
        # Since Case model doesn't have updated_by field, we'll use the creator or system
        activities.append({
            'type': 'case',
            'id': case.id,
            'title': case.title,
            'action': 'updated',
            'by': 'System',  # Default to System since we don't track who updated cases
            'timestamp': format_datetime_for_api(case.updated_at)
        })
    
    # Sort by timestamp and return top 15 most recent
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    return jsonify(activities[:15])

@dashboard_bp.route('/notifications')
@jwt_required()
def get_notifications():
    """Get recent notifications for the dashboard"""
    user_id = get_jwt_identity()
    user_id = int(user_id)
    
    # Get recent evidence uploads by the user as notifications
    recent_evidence = Evidence.query.filter_by(uploaded_by=user_id).filter(
        Evidence.uploaded_at > datetime.utcnow() - timedelta(hours=24)
    ).order_by(Evidence.uploaded_at.desc()).limit(10).all()
    
    # Get recent case updates for user's cases as notifications
    recent_cases = Case.query.filter_by(uploaded_by=user_id).filter(
        Case.updated_at > datetime.utcnow() - timedelta(hours=24)
    ).order_by(Case.updated_at.desc()).limit(5).all()
    
    notifications = []
    
    # Add evidence upload notifications
    for evidence in recent_evidence:
        uploader = User.query.get(evidence.uploaded_by)
        case = Case.query.get(evidence.case_id)
        notifications.append({
            'id': f'evidence_{evidence.id}',
            'type': 'evidence_uploaded',
            'title': 'Evidence Uploaded',
            'message': f'Evidence "{evidence.filename}" uploaded to case "{case.title if case else "Unknown"}"',
            'timestamp': format_datetime_for_api(evidence.uploaded_at),
            'read': False,
            'priority': 'medium',
            'case_id': evidence.case_id
        })
    
    # Add case update notifications
    for case in recent_cases:
        notifications.append({
            'id': f'case_{case.id}',
            'type': 'case_updated',
            'title': 'Case Updated',
            'message': f'Case "{case.title}" was updated',
            'timestamp': format_datetime_for_api(case.updated_at),
            'read': False,
            'priority': 'low'
        })
    
    # Sort by timestamp and return most recent
    notifications.sort(key=lambda x: x['timestamp'], reverse=True)
    return jsonify(notifications[:10])