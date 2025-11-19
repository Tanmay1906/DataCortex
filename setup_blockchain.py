#!/usr/bin/env python3
"""
TRM 2.0 Blockchain Setup Script
This script helps deploy the smart contract and configure the blockchain integration.
"""

import os
import sys
import json
import subprocess
from pathlib import Path

def run_command(command, cwd=None):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, cwd=cwd)
        if result.returncode != 0:
            print(f"Error running command: {command}")
            print(f"Error: {result.stderr}")
            return False, result.stderr
        return True, result.stdout
    except Exception as e:
        print(f"Exception running command {command}: {e}")
        return False, str(e)

def check_ganache():
    """Check if Ganache is running"""
    print("Checking Ganache connection...")
    try:
        import requests
        response = requests.post('http://127.0.0.1:7545', 
                               json={"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":1},
                               timeout=5)
        if response.status_code == 200:
            print("✓ Ganache is running")
            return True
        else:
            print("✗ Ganache is not responding properly")
            return False
    except Exception as e:
        print(f"✗ Cannot connect to Ganache: {e}")
        print("Please make sure Ganache is running on http://127.0.0.1:7545")
        return False

def install_truffle():
    """Install Truffle and dependencies"""
    print("Installing Truffle and dependencies...")
    
    # Check if npm is available
    success, _ = run_command("npm --version")
    if not success:
        print("✗ npm is not installed. Please install Node.js and npm first.")
        return False
    
    # Install Truffle globally
    print("Installing Truffle globally...")
    success, output = run_command("npm install -g truffle")
    if not success:
        print("✗ Failed to install Truffle globally")
        return False
    
    # Install local dependencies
    print("Installing project dependencies...")
    success, output = run_command("npm install")
    if not success:
        print("✗ Failed to install project dependencies")
        return False
    
    print("✓ Truffle and dependencies installed")
    return True

def compile_contracts():
    """Compile smart contracts"""
    print("Compiling smart contracts...")
    success, output = run_command("truffle compile")
    if not success:
        print("✗ Failed to compile contracts")
        return False
    
    print("✓ Contracts compiled successfully")
    return True

def deploy_contracts():
    """Deploy contracts to Ganache"""
    print("Deploying contracts to Ganache...")
    success, output = run_command("truffle migrate --reset --network development")
    if not success:
        print("✗ Failed to deploy contracts")
        print("Make sure Ganache is running and the network configuration is correct")
        return False
    
    print("✓ Contracts deployed successfully")
    
    # Extract deployment information
    try:
        # Parse deployment output to get contract address
        lines = output.split('\n')
        contract_address = None
        for line in lines:
            if 'EvidenceStorage:' in line and 'contract address:' in line:
                contract_address = line.split('contract address:')[1].strip()
                break
            elif 'contract address:' in line and contract_address is None:
                # Fallback to get any contract address
                contract_address = line.split('contract address:')[1].strip()
        
        if contract_address:
            print(f"✓ Contract deployed at address: {contract_address}")
            return contract_address
        else:
            print("Warning: Could not extract contract address from deployment output")
            return None
    except Exception as e:
        print(f"Warning: Could not parse deployment output: {e}")
        return None

def update_config(contract_address):
    """Update backend configuration with new contract address"""
    if not contract_address:
        print("Warning: No contract address provided, skipping config update")
        return
    
    print(f"Updating backend configuration with contract address: {contract_address}")
    
    # Update the config.py file
    config_path = Path("backend/app/config.py")
    if config_path.exists():
        with open(config_path, 'r') as f:
            content = f.read()
        
        # Replace the contract address
        content = content.replace(
            "CONTRACT_ADDRESS: str = os.getenv('CONTRACT_ADDRESS', '0xf8e81D47203A594245E36C48e151709F0C19fBe8')",
            f"CONTRACT_ADDRESS: str = os.getenv('CONTRACT_ADDRESS', '{contract_address}')"
        )
        
        with open(config_path, 'w') as f:
            f.write(content)
        
        print("✓ Backend configuration updated")
    else:
        print("✗ Backend config file not found")

def main():
    """Main setup function"""
    print("TRM 2.0 Blockchain Setup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("truffle-config.js").exists():
        print("✗ Not in the correct directory. Please run this script from the TRM2.0 root directory.")
        sys.exit(1)
    
    # Check Ganache
    if not check_ganache():
        print("\nPlease start Ganache before running this setup script.")
        print("1. Open Ganache")
        print("2. Create a new workspace or open existing")
        print("3. Make sure it's running on port 7545")
        sys.exit(1)
    
    # Install Truffle
    if not install_truffle():
        sys.exit(1)
    
    # Compile contracts
    if not compile_contracts():
        sys.exit(1)
    
    # Deploy contracts
    contract_address = deploy_contracts()
    if contract_address:
        update_config(contract_address)
    
    print("\n" + "=" * 40)
    print("✓ Blockchain setup completed!")
    print("\nNext steps:")
    print("1. Restart the backend server")
    print("2. The blockchain integration should now work properly")
    print("3. Upload evidence to test the blockchain functionality")
    
    if contract_address:
        print(f"\nContract Address: {contract_address}")
        print("You can view this contract in Ganache under the 'Contracts' tab")

if __name__ == "__main__":
    main()
