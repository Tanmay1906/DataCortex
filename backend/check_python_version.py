#!/usr/bin/env python3
"""
Python Version Compatibility Check for TRM 2.0 Backend
Ensures compatibility with Python 3.10.11
"""

import sys
import platform
from packaging import version

def check_python_version():
    """Check if the current Python version is compatible"""
    current_version = platform.python_version()
    required_version = "3.10.0"
    
    print(f"Current Python version: {current_version}")
    print(f"Required minimum version: {required_version}")
    
    if version.parse(current_version) >= version.parse(required_version):
        print("✅ Python version is compatible!")
        return True
    else:
        print("❌ Python version is too old. Please upgrade to Python 3.10.0 or higher.")
        return False

def check_required_modules():
    """Check if all required modules can be imported"""
    required_modules = [
        'flask',
        'flask_cors',
        'flask_jwt_extended',
        'flask_sqlalchemy',
        'flask_migrate',
        'psycopg2',
        'bcrypt',
        'web3',
        'dotenv',
        'werkzeug'
    ]
    
    missing_modules = []
    
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError:
            print(f"❌ {module} - NOT FOUND")
            missing_modules.append(module)
    
    if missing_modules:
        print(f"\n❌ Missing modules: {', '.join(missing_modules)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("\n✅ All required modules are available!")
        return True

if __name__ == "__main__":
    print("=" * 50)
    print("TRM 2.0 Backend Compatibility Check")
    print("=" * 50)
    
    version_ok = check_python_version()
    print()
    
    modules_ok = check_required_modules()
    print()
    
    if version_ok and modules_ok:
        print("🎉 Your Python environment is ready for TRM 2.0!")
        sys.exit(0)
    else:
        print("❌ Please fix the issues above before running the application.")
        sys.exit(1)
