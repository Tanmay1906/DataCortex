#!/usr/bin/env python3
"""
TRM 2.0 Backend Startup Script
Optimized for Python 3.10.11
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

try:
    from app import create_app
    from app.models.user import User
    from app.models.case import Case  
    from app.models.evidence import Evidence
    from app import db
    
    print("🚀 Starting TRM 2.0 Backend Server...")
    print(f"Python version: {sys.version}")
    
    app = create_app()
    
    @app.shell_context_processor
    def make_shell_context():
        return {
            'db': db,
            'User': User,
            'Case': Case,
            'Evidence': Evidence
        }
    
    if __name__ == '__main__':
        # Ensure upload directory exists
        upload_dir = Path(app.config['UPLOAD_FOLDER'])
        upload_dir.mkdir(exist_ok=True)
        
        print(f"✅ Upload directory: {upload_dir}")
        print(f"✅ Server starting on http://127.0.0.1:5000")
        print("✅ Ready to serve requests!")
        
        app.run(
            debug=True,
            host='127.0.0.1',
            port=5000,
            threaded=True
        )
        
except Exception as e:
    print(f"❌ Failed to start server: {e}")
    print("💡 Try running: python check_python_version.py")
    sys.exit(1)
