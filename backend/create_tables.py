#!/usr/bin/env python3
"""
Database initialization script for TRM 2.0 Backend
Creates all database tables using the Flask application factory pattern.
"""

import os
import sys
from app import create_app, db
from app.models import User, Case, Evidence, ChainOfCustody

def create_tables():
    """Create all database tables."""
    try:
        # Create the Flask app instance
        app = create_app()
        
        print("Creating Flask app instance...")
        print(f"Database URI: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')}")
        
        # Create application context and initialize database
        with app.app_context():
            print("Creating database tables...")
            
            # Drop all tables first (optional - remove if you want to preserve data)
            # db.drop_all()
            # print("Dropped existing tables")
            
            # Create all tables
            db.create_all()
            print("✓ All database tables created successfully!")
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"Created tables: {', '.join(tables)}")
            
            return True
            
    except Exception as e:
        print(f"✗ Error creating database tables: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("TRM 2.0 - Database Table Creation")
    print("=" * 40)
    
    success = create_tables()
    
    if success:
        print("\n✓ Database initialization completed successfully!")
        sys.exit(0)
    else:
        print("\n✗ Database initialization failed!")
        sys.exit(1)