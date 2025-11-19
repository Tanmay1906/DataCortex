# Case Detail Page Structure

## Overview
The case detail functionality has been restructured into a modular, well-organized system with separate components for better maintainability and scalability.

## File Structure

```
frontend/src/
├── pages/cases/
│   └── CaseDetailPage.jsx                    # Main case detail page with navigation tabs
├── components/cases/detail/
│   ├── CaseActions.jsx                       # Edit, Delete, Export, Share actions
│   └── sections/
│       ├── CaseMetadata.jsx                  # Core case information and statistics
│       ├── EvidenceList.jsx                  # Evidence files table with search/filter
│       ├── BlockchainLog.jsx                 # Blockchain transaction history
│       ├── UploadEvidence.jsx                # Drag-and-drop file upload with blockchain
│       └── AuditTrail.jsx                    # Compliance logging and activity history
```

## Components Description

### 1. 🔍 CaseDetailPage (Main Container)
- **Location**: `pages/cases/CaseDetailPage.jsx`
- **Purpose**: Main container with tab navigation
- **Features**:
  - Tab-based interface (Overview, Evidence, Blockchain, Upload, Audit)
  - Case loading and error handling
  - Responsive design with animations
  - Integration with all section components

### 2. 🔧 CaseActions
- **Location**: `components/cases/detail/CaseActions.jsx`
- **Purpose**: Action buttons and dropdown menu
- **Features**:
  - Edit case button
  - Delete case with confirmation modal
  - More actions dropdown (Export, Share, Archive)
  - Permission-based actions

### 3. 📊 CaseMetadata
- **Location**: `components/cases/detail/sections/CaseMetadata.jsx`
- **Purpose**: Core case information display
- **Features**:
  - Case title, description, status
  - Investigation details (lead investigator, evidence type)
  - Case statistics (evidence count, days active)
  - Priority indicators with color coding
  - Editable fields support

### 4. 📁 EvidenceList
- **Location**: `components/cases/detail/sections/EvidenceList.jsx`
- **Purpose**: Display and manage evidence files
- **Features**:
  - Sortable table with file details
  - Search and filter functionality
  - File type icons and size formatting
  - SHA256 hash display
  - Blockchain transaction hash links
  - Download and verification buttons
  - Status badges (Verified, Processing, Failed)

### 5. 🔗 BlockchainLog
- **Location**: `components/cases/detail/sections/BlockchainLog.jsx`
- **Purpose**: Blockchain transaction history
- **Features**:
  - Transaction timeline with confirmations
  - Gas usage tracking
  - Etherscan/Explorer links
  - Action badges (Upload, Verify, Update)
  - Network information
  - Hash integrity verification display

### 6. 📤 UploadEvidence
- **Location**: `components/cases/detail/sections/UploadEvidence.jsx`
- **Purpose**: File upload with blockchain integration
- **Features**:
  - Drag-and-drop interface (react-dropzone)
  - Multiple file support
  - Real-time SHA256 hash calculation
  - Blockchain storage simulation
  - Upload progress tracking
  - File description fields
  - Upload status indicators
  - Auto-linking to current case

### 7. 🗂️ AuditTrail
- **Location**: `components/cases/detail/sections/AuditTrail.jsx`
- **Purpose**: Compliance and activity logging
- **Features**:
  - Timeline view of all activities
  - User tracking with roles
  - IP address and user agent logging
  - Activity filtering (action, user, date range)
  - Export functionality
  - Compliance reporting
  - Detailed activity context

## Key Features

### 🎨 Design System
- Consistent cyberpunk/forensics theme
- Glassmorphism effects with backdrop blur
- Animated transitions (framer-motion)
- Responsive grid layouts
- Color-coded status indicators

### 🔐 Security Features
- User permission checking
- IP address tracking
- Complete audit trail
- Blockchain integrity verification
- Secure file hash calculation

### 📱 User Experience
- Tab-based navigation
- Real-time search and filtering
- Loading states and error handling
- Responsive design for all screen sizes
- Keyboard navigation support

### 🔧 Technical Features
- Modular component architecture
- Reusable utility functions
- Mock data for development
- API-ready structure
- TypeScript-friendly design

## Integration Points

### API Endpoints (To Implement)
```javascript
// Evidence API
getEvidenceByCase(caseId)
uploadEvidence(caseId, fileData)
deleteEvidence(evidenceId)

// Blockchain API
getBlockchainLogsByCase(caseId)
verifyFileIntegrity(fileHash)
storeOnBlockchain(fileHash, metadata)

// Audit API
getAuditLogsByCase(caseId)
logActivity(caseId, action, details)
exportAuditLog(caseId, format)
```

### Services Integration
- File upload service
- Blockchain service (Web3/Ethers.js)
- Hash calculation (Web Crypto API)
- Audit logging service

## Usage

The new structure is already integrated into the routing system. When users click on a case card, they will navigate to the new tabbed interface:

1. **Overview Tab** - Case metadata and statistics
2. **Evidence Tab** - File management and viewing
3. **Blockchain Tab** - Transaction history and verification
4. **Upload Tab** - Add new evidence files
5. **Audit Tab** - Activity history and compliance

## Benefits

1. **Better Organization**: Clear separation of concerns
2. **Maintainability**: Each section is independently maintainable
3. **Scalability**: Easy to add new sections or features
4. **Reusability**: Components can be reused in other contexts
5. **Testing**: Each component can be tested independently
6. **Performance**: Only active tabs load their data
7. **User Experience**: Professional, intuitive interface

## Next Steps

1. Connect components to real API endpoints
2. Implement actual blockchain integration
3. Add real file upload/download functionality
4. Implement audit logging backend
5. Add user permission system
6. Create automated tests for components
