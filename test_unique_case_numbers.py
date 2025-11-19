#!/usr/bin/env python3
"""
Test script for unique case number generation
"""

import sys
import os

# Add the backend directory to the path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

from app import create_app
from app.models.case import Case
from app.services.cases_services import CaseService

def test_case_number_generation():
    """Test the unique case number generation functionality"""
    
    app = create_app()
    
    with app.app_context():
        print("Testing unique case number generation...")
        
        # Test 1: Generate next case number
        print("\n1. Testing next case number generation:")
        try:
            next_number = CaseService.get_next_case_number()
            print(f"   Next case number: {next_number}")
            
            # Validate format
            if Case.validate_case_number(next_number):
                print("   ✓ Case number format is valid")
            else:
                print("   ✗ Case number format is invalid")
                
        except Exception as e:
            print(f"   ✗ Error generating next case number: {e}")
        
        # Test 2: Create a new case
        print("\n2. Testing case creation with auto-generated number:")
        try:
            case = CaseService.create_case(
                title="Test Case for Unique ID",
                description="Testing automatic case number generation",
                status="low",
                priority="low", 
                lead_investigator="Test Investigator",
                evidence_type="digital",
                uploaded_by=1  # Assuming user ID 1 exists
            )
            print(f"   ✓ Case created successfully")
            print(f"   Case ID: {case.id}")
            print(f"   Case Number: {case.case_number}")
            print(f"   Title: {case.title}")
            
        except Exception as e:
            print(f"   ✗ Error creating case: {e}")
        
        # Test 3: Generate another case number to ensure uniqueness
        print("\n3. Testing uniqueness - creating another case:")
        try:
            case2 = CaseService.create_case(
                title="Second Test Case for Unique ID",
                description="Testing uniqueness of case numbers",
                status="urgent",
                priority="high",
                lead_investigator="Another Investigator",
                evidence_type="mobile",
                uploaded_by=1
            )
            print(f"   ✓ Second case created successfully")
            print(f"   Case ID: {case2.id}")
            print(f"   Case Number: {case2.case_number}")
            
            # Check if numbers are different
            if case.case_number != case2.case_number:
                print("   ✓ Case numbers are unique")
            else:
                print("   ✗ Case numbers are not unique!")
                
        except Exception as e:
            print(f"   ✗ Error creating second case: {e}")
        
        # Test 4: Verify format validation
        print("\n4. Testing case number format validation:")
        test_numbers = [
            "TRM-2025-0001",  # Valid
            "TRM-2025-9999",  # Valid
            "TRM-25-001",     # Invalid (year too short)
            "DF-2025-001",    # Invalid (wrong prefix)
            "TRM-2025-001",   # Invalid (sequence too short)
            "TRM-2025-12345", # Invalid (sequence too long)
        ]
        
        for test_num in test_numbers:
            is_valid = Case.validate_case_number(test_num)
            status = "✓" if is_valid else "✗"
            print(f"   {status} {test_num}: {'Valid' if is_valid else 'Invalid'}")

if __name__ == "__main__":
    test_case_number_generation()
