import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProfileService from '../../services/profile';

const SettingsForm = ({ onSuccess, onError }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email_notifications: true,
      case_updates: true,
      evidence_alerts: true,
      system_notifications: false
    },
    security: {
      two_factor_enabled: false,
      session_timeout: 30,
      password_last_changed: null
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      date_format: 'MM/DD/YYYY'
    },
    privacy: {
      profile_visibility: 'team',
      activity_tracking: true,
      data_retention: 365
    }
  });

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await ProfileService.getSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      if (onError) {
        onError('Failed to load settings');
      }
    } finally {
      setInitialLoad(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ProfileService.updateSettings(settings);
      if (response.success) {
        if (onSuccess) {
          onSuccess('Settings updated successfully');
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update settings';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Notifications Section */}
      <motion.div className="relative" variants={itemVariants}>
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-pulse"></div>
          
          <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <span>Notification Center</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ml-auto"></div>
          </h3>
          
          <div className="space-y-6">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <motion.div 
                key={key} 
                className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-200 block mb-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  <p className="text-xs text-slate-400">
                    {getNotificationDescription(key)}
                  </p>
                </div>
                <div className="ml-6">
                  <button
                    type="button"
                    onClick={() => handleSettingChange('notifications', key, !value)}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                      value 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/25' 
                        : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                    {value && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-400/30 animate-pulse"></div>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div className="relative" variants={itemVariants}>
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 animate-pulse"></div>
          
          <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <span>Security Protocols</span>
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ml-auto"></div>
          </h3>
          
          <div className="space-y-6">
            <motion.div 
              className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-200 block mb-1">
                  Two-Factor Authentication
                </label>
                <p className="text-xs text-slate-400">
                  Enhanced security layer for account protection
                </p>
              </div>
              <div className="ml-6">
                <button
                  type="button"
                  onClick={() => handleSettingChange('security', 'two_factor_enabled', !settings.security.two_factor_enabled)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    settings.security.two_factor_enabled 
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-lg shadow-red-500/25' 
                      : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                      settings.security.two_factor_enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                  {settings.security.two_factor_enabled && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-400/30 to-orange-400/30 animate-pulse"></div>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30"
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Session Timeout Duration
              </label>
              <select
                value={settings.security.session_timeout}
                onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={240}>4 hours</option>
              </select>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div className="relative" variants={itemVariants}>
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500 animate-pulse"></div>
          
          <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
              </svg>
            </div>
            <span>User Preferences</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse ml-auto"></div>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries({
              theme: { label: 'Interface Theme', options: [
                { value: 'light', label: 'Light Mode' },
                { value: 'dark', label: 'Dark Mode' },
                { value: 'auto', label: 'Auto Detect' }
              ]},
              language: { label: 'Language', options: [
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]},
              timezone: { label: 'Timezone', options: [
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'Eastern Time' },
                { value: 'America/Chicago', label: 'Central Time' },
                { value: 'America/Denver', label: 'Mountain Time' },
                { value: 'America/Los_Angeles', label: 'Pacific Time' }
              ]},
              date_format: { label: 'Date Format', options: [
                { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
              ]}
            }).map(([key, config]) => (
              <motion.div 
                key={key}
                className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30"
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-sm font-medium text-slate-200 mb-3">
                  {config.label}
                </label>
                <select
                  value={settings.preferences[key]}
                  onChange={(e) => handleSettingChange('preferences', key, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                >
                  {config.options.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Privacy Section */}
      <motion.div className="relative" variants={itemVariants}>
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-400 to-purple-500 animate-pulse"></div>
          
          <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
              </svg>
            </div>
            <span>Privacy Controls</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse ml-auto"></div>
          </h3>
          
          <div className="space-y-6">
            <motion.div 
              className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30"
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Profile Visibility Level
              </label>
              <select
                value={settings.privacy.profile_visibility}
                onChange={(e) => handleSettingChange('privacy', 'profile_visibility', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              >
                <option value="public">Public - Visible to all users</option>
                <option value="team">Team Only - Department members</option>
                <option value="private">Private - Only administrators</option>
              </select>
            </motion.div>

            <motion.div 
              className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-200 block mb-1">
                  Activity Tracking
                </label>
                <p className="text-xs text-slate-400">
                  Allow system to monitor usage patterns for analytics
                </p>
              </div>
              <div className="ml-6">
                <button
                  type="button"
                  onClick={() => handleSettingChange('privacy', 'activity_tracking', !settings.privacy.activity_tracking)}
                  className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    settings.privacy.activity_tracking 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
                      : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${
                      settings.privacy.activity_tracking ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                  {settings.privacy.activity_tracking && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 animate-pulse"></div>
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/30"
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-sm font-medium text-slate-200 mb-3">
                Data Retention Period
              </label>
              <select
                value={settings.privacy.data_retention}
                onChange={(e) => handleSettingChange('privacy', 'data_retention', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
              >
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>1 year</option>
                <option value={730}>2 years</option>
                <option value={-1}>Indefinite</option>
              </select>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Submit Button */}
      <motion.div className="flex justify-center pt-4" variants={itemVariants}>
        <motion.button
          type="submit"
          disabled={loading}
          className={`relative px-8 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-xl transition-all duration-500 ${
            loading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 focus:ring-4 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900'
          } overflow-hidden group`}
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700"></div>
          
          <span className="relative z-10 flex items-center gap-3">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Updating Settings...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Save Configuration
              </>
            )}
          </span>
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

// Helper function for notification descriptions
const getNotificationDescription = (key) => {
  const descriptions = {
    email_notifications: 'Receive email notifications for important updates',
    case_updates: 'Get notified when cases are updated or assigned',
    evidence_alerts: 'Receive alerts when new evidence is uploaded',
    system_notifications: 'System maintenance and security notifications'
  };
  return descriptions[key] || '';
};

export default SettingsForm;
