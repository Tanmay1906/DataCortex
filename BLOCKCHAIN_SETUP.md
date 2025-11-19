# TRM 2.0 Blockchain Integration Setup

This guide will help you set up the blockchain integration for TRM 2.0 with Ganache.

## Prerequisites

1. **Node.js and npm** - Download from [nodejs.org](https://nodejs.org/)
2. **Ganache** - Download from [trufflesuite.com/ganache](https://trufflesuite.com/ganache/)
3. **Python 3.8+** with requests package: `pip install requests`

## Setup Steps

### 1. Start Ganache

1. Open Ganache
2. Create a new workspace or quickstart
3. Make sure it's running on `HTTP://127.0.0.1:7545`
4. Note down one of the account addresses and private keys

### 2. Configure Environment

Update the configuration in `backend/app/config.py`:

```python
# Use one of the accounts from Ganache
PUBLIC_ADDRESS: str = os.getenv('PUBLIC_ADDRESS', 'YOUR_GANACHE_ACCOUNT_ADDRESS')
PRIVATE_KEY: str = os.getenv('PRIVATE_KEY', 'YOUR_GANACHE_PRIVATE_KEY')
```

### 3. Run the Setup Script

From the TRM2.0 root directory, run:

```bash
python setup_blockchain.py
```

This script will:
- Install Truffle and dependencies
- Compile the smart contracts
- Deploy them to Ganache
- Update the backend configuration

### 4. Restart the Backend

Stop and restart your backend server to pick up the new configuration:

```bash
cd backend
python run.py
```

### 5. Test the Integration

1. Open the TRM 2.0 frontend
2. Upload evidence to a case
3. Check the Evidence Details to see blockchain verification
4. View the Blockchain Log section in case details
5. Check Ganache for the actual transactions

## Manual Setup (Alternative)

If the setup script doesn't work, you can do it manually:

### 1. Install Truffle

```bash
npm install -g truffle
npm install
```

### 2. Compile and Deploy

```bash
truffle compile
truffle migrate --reset --network development
```

### 3. Update Config

Take the deployed contract address from the migration output and update `backend/app/config.py`:

```python
CONTRACT_ADDRESS: str = os.getenv('CONTRACT_ADDRESS', 'YOUR_DEPLOYED_CONTRACT_ADDRESS')
```

## Verification

After setup, you should see:

1. **Real blockchain transactions** instead of `fallback_` hashes
2. **Proper transaction data** in the Blockchain Log
3. **Contract details** in Ganache under the Contracts tab
4. **Transaction history** in Ganache under the Transactions tab

## Troubleshooting

### "Blockchain not connected" error
- Make sure Ganache is running on port 7545
- Check the GANACHE_URL in config.py

### "Contract not found" error
- Run the deployment again: `truffle migrate --reset`
- Update the CONTRACT_ADDRESS in config.py

### "Transaction failed" error
- Check account balance in Ganache
- Verify the private key matches the public address
- Make sure the account is unlocked in Ganache

### Gas estimation errors
- Increase gas limit in the blockchain service
- Check Ganache gas limit settings

## Contract Functions

The deployed contract provides these functions:

- `logEvidence(caseId, evidenceHash)` - Store evidence hash
- `verifyEvidenceHash(caseId, evidenceHash)` - Verify evidence exists
- `getCaseEvidenceHashes(caseId)` - Get all evidence for a case
- `setUploader(address, authorized)` - Authorize uploaders (owner only)

## File Structure

```
TRM2.0/
├── contracts/
│   ├── EvidenceStorage.sol      # Main smart contract
│   └── Migrations.sol           # Truffle migrations contract
├── migrations/
│   ├── 1_initial_migration.js   # Deploy migrations
│   └── 2_deploy_contracts.js    # Deploy evidence storage
├── truffle-config.js            # Truffle configuration
├── package.json                 # Node.js dependencies
└── setup_blockchain.py          # Automated setup script
```
