#!/usr/bin/env python3
"""
Test script to verify that file uploads now properly set the file_path
"""
import os
from app import create_app, db
from app.models.evidence import Evidence

def test_latest_evidence():
    app = create_app()
    with app.app_context():
        # Get the latest evidence record
        latest_evidence = Evidence.query.order_by(Evidence.id.desc()).first()
        
        if latest_evidence:
            print(f"Latest Evidence ID: {latest_evidence.id}")
            print(f"Filename: {latest_evidence.filename}")
            print(f"File path: {latest_evidence.file_path}")
            print(f"File exists: {os.path.exists(latest_evidence.file_path) if latest_evidence.file_path else False}")
            print(f"MIME type: {latest_evidence.mime_type}")
        else:
            print("No evidence found")

if __name__ == "__main__":
    test_latest_evidence()
