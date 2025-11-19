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
  const [focusedField, setFocusedField] = useState('');

  useEffect(() => {
    loadProfile();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadProfile = async () => {
    try {
      // Check if user is authenticated first
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
      
      // Handle different types of errors
      if (!error.response) {
        // Network error or CORS issue
        if (onError) {
          onError('Unable to connect to server. Please check if you are logged in and try again.');
        }
      } else if (error.response.status === 401) {
        // Authentication error
        if (onError) {
          onError('Your session has expired. Please log in again.');
        }
      } else {
        // Other server errors
        if (onError) {
          onError('Failed to load profile data. Please try again.');
        }
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
    
    // Clear error when user starts typing
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

    // Check authentication before submitting
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
      
      // Handle different types of errors
      if (!error.response) {
        // Network error or CORS issue
        if (onError) {
          onError('Unable to connect to server. Please check your connection and try again.');
        }
      } else if (error.response.status === 401) {
        // Authentication error
        if (onError) {
          onError('Your session has expired. Please log in again.');
        }
      } else {
        // Other server errors
        const errorMessage = error.response?.data?.error || 'Failed to update profile. Please try again.';
        if (onError) {
          onError(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Show authentication message if user is not logged in
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
          <p className="text-gray-600">Please log in to access your profile settings.</p>
        </div>
      </motion.div>
    );
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center p-12">
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-slate-700/30 border-t-cyan-400 rounded-full"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin"></div>
        </motion.div>
        <div className="ml-4">
          <div className="text-slate-300 font-medium">Loading Profile Data</div>
          <div className="text-slate-500 text-sm">Retrieving your information...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {/* Personal Information Section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200">Personal Information</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                  text-slate-200 placeholder-slate-500 transition-all duration-300
                  focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 focus:bg-slate-800/70
                  hover:bg-slate-800/60 backdrop-blur-sm
                  ${errors.name ? 'border-red-500/50 focus:ring-red-400/50' : 'border-slate-600/50'}
                  ${focusedField === 'name' ? 'shadow-lg shadow-emerald-400/25' : ''}
                `}
                placeholder="Enter your full name"
                required
              />
              {focusedField === 'name' && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-emerald-400/30 pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                />
              )}
            </div>
            {errors.name && (
              <motion.p 
                className="text-sm text-red-400 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.name}
              </motion.p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Email Address
              <div className="ml-auto text-xs text-slate-500 bg-slate-700/50 px-2 py-1 rounded-md">Read-only</div>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-800/30 border border-slate-600/30 rounded-xl 
                  text-slate-400 placeholder-slate-500 transition-all duration-300
                  cursor-not-allowed opacity-75"
                placeholder="Enter your email"
                disabled
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Professional Information Section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200">Professional Details</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="department" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              Department
            </label>
            <div className="relative">
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('department')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                  text-slate-200 placeholder-slate-500 transition-all duration-300
                  focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 focus:bg-slate-800/70
                  hover:bg-slate-800/60 backdrop-blur-sm
                  ${focusedField === 'department' ? 'shadow-lg shadow-blue-400/25' : ''}
                  ${errors.department ? 'border-red-500/50' : 'border-slate-600/50'}
                `}
                placeholder="e.g., Digital Forensics, Cybercrime Unit"
              />
              {focusedField === 'department' && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-blue-400/30 pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                />
              )}
            </div>
          </motion.div>

          {/* Badge Number */}
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="badge_number" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              Badge Number
            </label>
            <div className="relative">
              <input
                type="text"
                id="badge_number"
                name="badge_number"
                value={formData.badge_number}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('badge_number')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                  text-slate-200 placeholder-slate-500 transition-all duration-300
                  focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-slate-800/70
                  hover:bg-slate-800/60 backdrop-blur-sm
                  ${focusedField === 'badge_number' ? 'shadow-lg shadow-purple-400/25' : ''}
                  ${errors.badge_number ? 'border-red-500/50' : 'border-slate-600/50'}
                `}
                placeholder="e.g., DF-12345"
              />
              {focusedField === 'badge_number' && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-purple-400/30 pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                />
              )}
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                  text-slate-200 placeholder-slate-500 transition-all duration-300
                  focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 focus:bg-slate-800/70
                  hover:bg-slate-800/60 backdrop-blur-sm
                  ${focusedField === 'phone' ? 'shadow-lg shadow-cyan-400/25' : ''}
                  ${errors.phone ? 'border-red-500/50' : 'border-slate-600/50'}
                `}
                placeholder="+1 (555) 123-4567"
              />
              {focusedField === 'phone' && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                />
              )}
            </div>
            {errors.phone && (
              <motion.p 
                className="text-sm text-red-400 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.phone}
              </motion.p>
            )}
          </motion.div>

          {/* Position */}
          <motion.div 
            className="space-y-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="position" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              Position/Title
            </label>
            <div className="relative">
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('position')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                  text-slate-200 placeholder-slate-500 transition-all duration-300
                  focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400 focus:bg-slate-800/70
                  hover:bg-slate-800/60 backdrop-blur-sm
                  ${focusedField === 'position' ? 'shadow-lg shadow-yellow-400/25' : ''}
                  border-slate-600/50
                `}
                placeholder="e.g., Senior Digital Forensics Analyst"
              />
              {focusedField === 'position' && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-yellow-400/30 pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                />
              )}
            </div>
          </motion.div>

          {/* Location */}
          <motion.div 
            className="space-y-2 md:col-span-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <label htmlFor="location" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
              Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('location')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                  text-slate-200 placeholder-slate-500 transition-all duration-300
                  focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 focus:bg-slate-800/70
                  hover:bg-slate-800/60 backdrop-blur-sm
                  ${focusedField === 'location' ? 'shadow-lg shadow-orange-400/25' : ''}
                  border-slate-600/50
                `}
                placeholder="e.g., New York, NY, United States"
              />
              {focusedField === 'location' && (
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-orange-400/30 pointer-events-none"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                />
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bio Section */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-200">Biography</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/30 to-transparent"></div>
        </div>

        <motion.div 
          className="space-y-2"
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <label htmlFor="bio" className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Professional Summary
            <div className="ml-auto text-xs text-slate-500">Optional</div>
          </label>
          <div className="relative">
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('bio')}
              onBlur={() => setFocusedField('')}
              rows={5}
              className={`w-full px-4 py-3 bg-slate-800/50 border rounded-xl 
                text-slate-200 placeholder-slate-500 transition-all duration-300
                focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-slate-800/70
                hover:bg-slate-800/60 backdrop-blur-sm resize-none
                ${focusedField === 'bio' ? 'shadow-lg shadow-purple-400/25' : ''}
                border-slate-600/50
              `}
              placeholder="Brief description about yourself, your expertise, and professional background in digital forensics..."
            />
            {focusedField === 'bio' && (
              <motion.div 
                className="absolute inset-0 rounded-xl border-2 border-purple-400/30 pointer-events-none"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              />
            )}
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {formData.bio.length}/500
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Submit Section */}
      <motion.div 
        className="flex justify-end pt-6 border-t border-slate-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          type="submit"
          disabled={loading}
          className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden
            ${loading 
              ? 'bg-slate-600 cursor-not-allowed opacity-50' 
              : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40'
            }
            text-white transform hover:scale-105 active:scale-95
          `}
          whileHover={!loading ? { scale: 1.05 } : {}}
          whileTap={!loading ? { scale: 0.95 } : {}}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-5 h-5 border-2 border-slate-300/30 border-t-white rounded-full animate-spin"></div>
              </div>
              Updating Profile...
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Update Profile
            </div>
          )}
          
          {!loading && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          )}
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default ProfileForm;
