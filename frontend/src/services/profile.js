import api from './api';

class ProfileService {
  /**
   * Get current user's profile
   */
  static async getProfile() {
    try {
      const response = await api.get('/admin/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Update current user's profile
   */
  static async updateProfile(profileData) {
    try {
      const response = await api.post('/admin/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Get user settings
   */
  static async getSettings() {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  }

  /**
   * Update user settings
   */
  static async updateSettings(settingsData) {
    try {
      const response = await api.post('/admin/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  /**
   * Upload profile avatar
   */
  static async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/admin/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }

  /**
   * Validate profile data before submission
   */
  static validateProfileData(data) {
    const errors = {};

    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (data.name.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone.replace(/[-\s\(\)]/g, ''))) {
      errors.phone = 'Invalid phone number format';
    }

    if (data.department && data.department.length > 100) {
      errors.department = 'Department must be less than 100 characters';
    }

    if (data.badge_number && data.badge_number.length > 50) {
      errors.badge_number = 'Badge number must be less than 50 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default ProfileService;
