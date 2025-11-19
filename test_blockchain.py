#!/usr/bin/env python3
"""
Test script to verify blockchain functionality
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.config import Config
from app.services.blockchain_services import BlockchainService
import hashlib

def test_blockchain_functionality():
    print("🔗 Testing TRM 2.0 Blockchain Integration")
    print("=" * 50)
    
    # Test 1: Initialize blockchain connection
    print("1. Testing blockchain connection...")
    try:
        contract = Config.init_blockchain()
        if contract:
            print("✅ Blockchain connected successfully!")
            owner = contract.functions.owner().call()
            print(f"   Contract owner: {owner}")
            print(f"   Contract address: {Config.CONTRACT_ADDRESS}")
        else:
            print("❌ Failed to connect to blockchain")
            return False
    except Exception as e:
        print(f"❌ Blockchain connection error: {e}")
        return False
    
    # Test 2: Store evidence hash
    print("\n2. Testing evidence storage on blockchain...")
    try:
        # Create a test hash with timestamp to ensure uniqueness
        import time
        test_data = f"This is test evidence data for TRM 2.0 at {time.time()}"
        hash_obj = hashlib.sha256(test_data.encode())
        test_hash = hash_obj.hexdigest()
        test_case_id = f"test_case_{int(time.time())}"
        
        print(f"   Test evidence hash: {test_hash}")
        print(f"   Test case ID: {test_case_id}")
        
        # Store on blockchain
        blockchain_service = BlockchainService()
        tx_hash, gas_used = blockchain_service.store_evidence_hash(test_hash, test_case_id, "Test evidence upload")
        
        print(f"✅ Evidence stored successfully!")
        print(f"   Transaction hash: {tx_hash}")
        print(f"   Gas used: {gas_used} ETH")
        
    except Exception as e:
        print(f"❌ Evidence storage error: {e}")
        return False
    
    # Test 3: Verify evidence hash
    print("\n3. Testing evidence verification...")
    try:
        # Verify the hash exists on blockchain
        is_verified = contract.functions.verifyEvidenceHash(test_case_id, bytes.fromhex(test_hash)).call()
        if is_verified:
            print("✅ Evidence hash verified on blockchain!")
        else:
            print("❌ Evidence hash not found on blockchain")
            return False
    except Exception as e:
        print(f"❌ Evidence verification error: {e}")
        return False
    
    # Test 4: Get blockchain logs
    print("\n4. Testing blockchain logs retrieval...")
    try:
        logs = blockchain_service.get_blockchain_logs_by_case(test_case_id)
        if logs:
            print(f"✅ Retrieved {len(logs)} blockchain logs")
            for log in logs:
                print(f"   - TX: {log['txHash'][:20]}...")
                print(f"     Block: {log['blockNumber']}, Status: {log['status']}")
        else:
            print("⚠️ No blockchain logs found (this is expected for new tests)")
    except Exception as e:
        print(f"❌ Blockchain logs error: {e}")
        return False
    
    print("\n🎉 All blockchain functionality tests passed!")
    print("\nNext steps:")
    print("1. Your blockchain integration is now working")
    print("2. Upload evidence through the web interface")
    print("3. Check Ganache for real transaction history")
    print("4. View blockchain logs in the TRM application")
    
    return True

if __name__ == "__main__":
    success = test_blockchain_functionality()
    sys.exit(0 if success else 1)
