import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileService from '../../services/profile';
import { useAuth } from '../../contexts/AuthContext';

const ProfileForm = ({ onSuccess, onError }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    badge_number: '',
    phone: '',
    position: '',
    location: '',
    bio: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [isAuthenticated]);

  const loadProfile = async () => {
    try {
      if (!isAuthenticated) {
        console.log('No authentication token found');
        if (onError) {
          onError('You need to log in to view your profile. Please log in first.');
        }
        setInitialLoad(false);
        return;
      }

      const response = await ProfileService.getProfile();
      if (response.success && response.data) {
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          department: response.data.department || '',
          badge_number: response.data.badge_number || '',
          phone: response.data.phone || '',
          position: response.data.position || '',
          location: response.data.location || '',
          bio: response.data.bio || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      if (onError) {
        onError('Failed to load profile data. Please try again.');
      }
    } finally {
      setInitialLoad(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!isAuthenticated) {
      if (onError) {
        onError('You need to log in to update your profile. Please log in first.');
      }
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await ProfileService.updateProfile(formData);
      if (response.success) {
        if (onSuccess) {
          onSuccess('Profile updated successfully');
        }
        setErrors({});
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile. Please try again.';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access your profile settings.</p>
        </div>
      </motion.div>
    );
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-300 font-medium">Loading Profile Data...</div>
      </div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
                text-slate-200 placeholder-slate-500 transition-all duration-300
                focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400"
              placeholder="Enter your full name"
              required
            />
            {errors.name && (
              <p className="text-sm text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/30 border border-slate-600/30 rounded-lg 
                text-slate-400 placeholder-slate-500 cursor-not-allowed opacity-75"
              placeholder="Enter your email"
              disabled
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-2">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
                text-slate-200 placeholder-slate-500 transition-all duration-300
                focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400"
              placeholder="e.g., Digital Forensics"
            />
          </div>

          <div>
            <label htmlFor="badge_number" className="block text-sm font-medium text-slate-300 mb-2">
              Badge Number
            </label>
            <input
              type="text"
              id="badge_number"
              name="badge_number"
              value={formData.badge_number}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
                text-slate-200 placeholder-slate-500 transition-all duration-300
                focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400"
              placeholder="e.g., DF-12345"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
                text-slate-200 placeholder-slate-500 transition-all duration-300
                focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-slate-300 mb-2">
              Position/Title
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
                text-slate-200 placeholder-slate-500 transition-all duration-300
                focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400"
              placeholder="e.g., Senior Digital Forensics Analyst"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
              text-slate-200 placeholder-slate-500 transition-all duration-300
              focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400"
            placeholder="e.g., New York, NY, United States"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2">
            Professional Summary
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg 
              text-slate-200 placeholder-slate-500 transition-all duration-300
              focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 resize-none"
            placeholder="Brief description about yourself and your expertise..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-700/50">
        <motion.button
          type="submit"
          disabled={loading}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300
            ${loading 
              ? 'bg-slate-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
            }
            text-white`}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ProfileForm;
