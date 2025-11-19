#!/usr/bin/env python3
"""
Test script for Profile and Settings endpoints
"""

import requests
import json
import sys

BASE_URL = "http://localhost:5000/api"

def test_endpoints():
    """Test the profile and settings endpoints"""
    
    print("=== Testing TRM Profile & Settings API ===\n")
    
    # Test data
    login_data = {
        "email": "admin@test.com",
        "password": "admin123"
    }
    
    profile_data = {
        "name": "John Doe",
        "department": "Digital Forensics",
        "badge_number": "DF-12345",
        "phone": "+1-555-123-4567",
        "position": "Senior Analyst",
        "location": "New York, NY",
        "bio": "Experienced digital forensics investigator specializing in cybercrime cases."
    }
    
    settings_data = {
        "notifications": {
            "email_notifications": True,
            "case_updates": False,
            "evidence_alerts": True,
            "system_notifications": True
        },
        "preferences": {
            "theme": "dark",
            "language": "en",
            "timezone": "America/New_York"
        }
    }

    # Test login first
    print("1. Testing Login...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            token = response.json().get('access_token')
            headers = {'Authorization': f'Bearer {token}'}
            print("   ✓ Login successful")
        else:
            print(f"   ✗ Login failed: {response.status_code} - {response.text}")
            return
    except requests.exceptions.RequestException as e:
        print(f"   ✗ Login error: {e}")
        return

    # Test GET profile
    print("\n2. Testing GET Profile...")
    try:
        response = requests.get(f"{BASE_URL}/admin/profile", headers=headers)
        if response.status_code == 200:
            print("   ✓ Get profile successful")
            print(f"   Profile data: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   ✗ Get profile failed: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"   ✗ Get profile error: {e}")

    # Test POST profile
    print("\n3. Testing POST Profile...")
    try:
        response = requests.post(f"{BASE_URL}/admin/profile", json=profile_data, headers=headers)
        if response.status_code == 200:
            print("   ✓ Update profile successful")
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   ✗ Update profile failed: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"   ✗ Update profile error: {e}")

    # Test GET settings
    print("\n4. Testing GET Settings...")
    try:
        response = requests.get(f"{BASE_URL}/admin/settings", headers=headers)
        if response.status_code == 200:
            print("   ✓ Get settings successful")
            print(f"   Settings data: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   ✗ Get settings failed: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"   ✗ Get settings error: {e}")

    # Test POST settings
    print("\n5. Testing POST Settings...")
    try:
        response = requests.post(f"{BASE_URL}/admin/settings", json=settings_data, headers=headers)
        if response.status_code == 200:
            print("   ✓ Update settings successful")
            print(f"   Response: {json.dumps(response.json(), indent=2)}")
        else:
            print(f"   ✗ Update settings failed: {response.status_code} - {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"   ✗ Update settings error: {e}")

    print("\n=== Test Complete ===")

if __name__ == "__main__":
    test_endpoints()
