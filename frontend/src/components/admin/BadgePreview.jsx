import { useState, useEffect } from 'react';
import ProfileService from '../../services/profile';

const BadgePreview = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await ProfileService.getProfile();
      if (response.success && response.data) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Preview</h3>
        <p className="text-gray-500">Unable to load profile data</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Preview</h3>
      
      {/* Digital Badge Card */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 rounded-xl p-6 text-white shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-16 h-16 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-white/20 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-sm font-medium opacity-90">DIGITAL FORENSICS</span>
            </div>
            <div className="text-xs opacity-75">
              {new Date().getFullYear()}
            </div>
          </div>

          {/* Profile Avatar */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center text-2xl font-bold">
              {profileData.name ? 
                profileData.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 
                'DF'
              }
            </div>
            <div>
              <h4 className="text-lg font-bold">
                {profileData.name || 'Unknown User'}
              </h4>
              <p className="text-sm opacity-90">
                {profileData.position || 'Digital Forensics Analyst'}
              </p>
            </div>
          </div>

          {/* Badge Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Badge ID:</span>
              <span className="text-sm font-mono bg-white/10 px-2 py-1 rounded">
                {profileData.badge_number || 'Not Set'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-75">Department:</span>
              <span className="text-sm">
                {profileData.department || 'Not Set'}
              </span>
            </div>
            
            {profileData.location && (
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-75">Location:</span>
                <span className="text-sm">
                  {profileData.location}
                </span>
              </div>
            )}
          </div>

          {/* Security Level Indicator */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-75">Security Level</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs font-medium">AUTHORIZED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Holographic Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-xl"></div>
      </div>

      {/* Statistics */}
      {profileData.statistics && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              {profileData.statistics.total_cases}
            </div>
            <div className="text-xs text-gray-600">Total Cases</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {profileData.statistics.evidence_files}
            </div>
            <div className="text-xs text-gray-600">Evidence Files</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgePreview;
