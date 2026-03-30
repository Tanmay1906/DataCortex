# DataCortex

**DataCortex** is a cyber-forensics case management platform that helps investigators organize **cases**, manage **digital evidence**, and track integrity workflows using **hashing**, **audit trails**, and **blockchain-style transaction logs**. The project includes a modern **React + Vite** frontend plus supporting backend/blockchain tooling in this repository.

## Key Features

- **Case Detail Dashboard (Tabbed UI)**
  - Overview, Evidence, Blockchain, Upload, and Audit sections
- **Evidence Management**
  - Evidence listing with search/filter
  - File metadata display (type/size)
  - **SHA256 hash** display for integrity workflows
  - Verification-style actions (UI)
- **Blockchain Log Viewer**
  - Transaction timeline/history UI (upload/verify/update events)
  - Network + transaction metadata display
- **Upload Evidence Module**
  - Drag-and-drop uploads (UI)
  - Real-time hash calculation (UI workflow)
  - Upload progress + status indicators
- **Audit Trail**
  - Compliance/activity timeline UI
  - Filtering and export-ready structure
- **Modular Frontend Architecture**
  - Maintainable components split into focused sections

---

## Repository Structure (High level)

```text
DataCortex/
├── frontend/                 # React + Vite frontend
├── backend/                  # Backend services (if configured)
├── contracts/                # Smart contracts (Truffle-style structure)
├── migrations/               # Contract migrations
├── aptos/                    # Additional blockchain experimentation (if used)
├── truffle-config.js         # Truffle configuration
├── setup_blockchain.py       # Helper script(s) for blockchain setup
├── test_blockchain.py        # Blockchain testing utilities
├── BLOCKCHAIN_SETUP.md       # Detailed setup docs
├── GANACHE_GUIDE.md          # Local chain guide
└── UNIQUE_CASE_ID_*.md       # Case ID implementation notes
```

---

## Prerequisites

- **Node.js** (recommended: latest LTS)
- **npm** (comes with Node)
- (Optional / depending on what you run) **Python 3.x**
- (Optional / blockchain) **Ganache** + **Truffle**

---

## Quick Start (Frontend)

```bash
git clone https://github.com/Tanmay1906/DataCortex.git
cd DataCortex/frontend
npm install
npm run dev
```

Vite will print a local dev URL (commonly `http://127.0.0.1:5173/`). Open it in your browser.

---

## Case Detail Module (Frontend)

The case detail functionality is organized into a modular structure:

```text
frontend/src/
├── pages/cases/
│   └── CaseDetailPage.jsx                    # Main container with navigation tabs
└── components/cases/detail/
    ├── CaseActions.jsx                       # Edit/Delete/Export/Share actions
    └── sections/
        ├── CaseMetadata.jsx                  # Case information + stats
        ├── EvidenceList.jsx                  # Evidence table + hash display
        ├── BlockchainLog.jsx                 # Blockchain transaction history UI
        ├── UploadEvidence.jsx                # Drag-and-drop upload workflow
        └── AuditTrail.jsx                    # Audit/compliance timeline
```

---

## Blockchain / Smart Contract Setup (Optional)

If you want to use the blockchain-related components and scripts, refer to:

- `BLOCKCHAIN_SETUP.md`
- `GANACHE_GUIDE.md`
- `truffle-config.js`
- `migrations/` + `contracts/`

Typical workflow (example):

```bash
# Start local chain (Ganache) then:
truffle compile
truffle migrate
```

> Note: Any deployed contract addresses / network configuration must be updated in the relevant backend or integration layer you are using.

---

## Notes

- This repo contains multiple guides like `PROFILE_SETTINGS_README.md` and `UNIQUE_CASE_ID_README.md` for specific features. They are good references for deeper implementation details.

---

## License

Add your license here (e.g., MIT) or remove this section if not applicable.
