# Profile and Settings Feature Documentation

## Overview
This document describes the newly implemented Profile and Settings features for the TRM (Digital Forensics) application.

## Backend Implementation

### API Endpoints

#### Profile Management
- **GET /api/admin/profile** - Retrieve current user's profile
- **POST /api/admin/profile** - Update current user's profile

#### Settings Management
- **GET /api/admin/settings** - Retrieve user settings
- **POST /api/admin/settings** - Update user settings

### Database Schema

#### User Model Extensions
The User model has been extended with the following fields:
- `name` - Full name (String, 100 chars)
- `department` - Department name (String, 100 chars)
- `badge_number` - Badge/ID number (String, 50 chars)
- `phone` - Phone number (String, 20 chars)
- `position` - Job position/title (String, 100 chars)
- `location` - Physical location (String, 100 chars)
- `bio` - Biography/description (Text)
- `created_at` - Account creation timestamp
- `updated_at` - Last profile update timestamp
- `last_login` - Last login timestamp

### Services

#### ProfileService
Located at `backend/app/services/profile_services.py`
- `get_user_profile(user_id)` - Fetch user profile data
- `update_user_profile(user_id, profile_data)` - Update profile with validation
- `get_user_statistics(user_id)` - Get user activity statistics
- `_validate_profile_data(data)` - Validate profile data

### Security
- All endpoints require JWT authentication
- Input validation for all profile fields
- No role-based restrictions (all authenticated users can access)

## Frontend Implementation

### Pages

#### Admin/Profile Page (`/admin`)
- **Location**: `frontend/src/pages/admin/AdminPage.jsx`
- **Features**:
  - Profile form for editing user information
  - Digital badge preview
  - Quick actions panel
  - Success/error messaging

#### Settings Page (`/settings`)
- **Location**: `frontend/src/pages/SettingsPage.jsx`
- **Features**:
  - Notification preferences
  - Security settings
  - Application preferences
  - Privacy controls

### Components

#### Profile Components
- **ProfileForm** (`frontend/src/components/admin/ProfileForm.jsx`)
  - Form for editing profile information
  - Real-time validation
  - Auto-loading of existing data

- **BadgePreview** (`frontend/src/components/admin/BadgePreview.jsx`)
  - Visual representation of digital badge
  - Department and badge number display
  - Statistics overview

#### Settings Components
- **SettingsForm** (`frontend/src/components/settings/SettingsForm.jsx`)
  - Comprehensive settings management
  - Toggle switches for boolean settings
  - Dropdown selectors for choices

### Services
- **ProfileService** (`frontend/src/services/profile.js`)
  - API integration for profile and settings
  - Client-side validation
  - Error handling

### Navigation
The sidebar has been updated to include:
- **Profile** - Links to `/admin` (renamed from "Admin")
- **Settings** - Links to `/settings`

Both are accessible to all authenticated users.

## File Structure

### Backend
```
backend/
├── app/
│   ├── models/
│   │   └── user.py (updated)
│   ├── routes/
│   │   └── admin.py (new)
│   ├── services/
│   │   └── profile_services.py (new)
│   └── utils/
│       └── jwt_utils.py (updated)
├── migrations/
│   └── versions/
│       └── 50f14b34a7be_add_profile_fields_to_user_table.py (new)
└── test_profile_api.py (new)
```

### Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ProfileForm.jsx (new)
│   │   │   ├── BadgePreview.jsx (new)
│   │   │   └── index.js (new)
│   │   ├── settings/
│   │   │   ├── SettingsForm.jsx (new)
│   │   │   └── index.js (new)
│   │   └── layout/
│   │       └── Sidebar.jsx (updated)
│   ├── pages/
│   │   ├── admin/
│   │   │   └── AdminPage.jsx (new)
│   │   └── SettingsPage.jsx (new)
│   ├── services/
│   │   └── profile.js (new)
│   └── routes.jsx (updated)
```

## Testing

### Backend Testing
Run the test script to verify API endpoints:
```bash
cd backend
python test_profile_api.py
```

### Frontend Testing
1. Start the development server
2. Navigate to `/admin` to test profile management
3. Navigate to `/settings` to test settings management

## Usage Instructions

### For Users

#### Updating Profile
1. Navigate to **Profile** in the sidebar
2. Fill out the profile form with your information
3. Click **"Update Profile"** to save changes
4. View your digital badge on the right panel

#### Managing Settings
1. Navigate to **Settings** in the sidebar
2. Adjust notification preferences
3. Configure security settings
4. Set application preferences
5. Click **"Save Settings"** to apply changes

### For Developers

#### Adding New Profile Fields
1. Update the User model in `backend/app/models/user.py`
2. Create a new migration: `flask db revision -m "description"`
3. Update the ProfileForm component to include the new field
4. Add validation in ProfileService if needed

#### Adding New Settings
1. Update the settings structure in `backend/app/routes/admin.py`
2. Add the new setting to SettingsForm component
3. Implement any backend logic if the setting affects application behavior

## Security Considerations

- All endpoints require valid JWT tokens
- Input validation prevents malicious data injection
- Profile visibility can be controlled through privacy settings
- Session timeout settings enhance security
- Two-factor authentication placeholder for future implementation

## Future Enhancements

- Role-based access control for admin functions
- Profile picture upload functionality
- Advanced notification system
- Audit logging for profile changes
- Export profile data functionality
- Advanced security features (2FA, etc.)

## Troubleshooting

### Common Issues

1. **Migration Errors**: Ensure database is accessible and migrations are run in order
2. **JWT Token Issues**: Check token expiration and refresh logic
3. **Validation Errors**: Review input formats and length requirements
4. **API Connection Issues**: Verify backend server is running and accessible

### Debug Mode
Enable debug mode for detailed error messages:
- Backend: Set `FLASK_DEBUG=1`
- Frontend: Check browser console for detailed error messages
