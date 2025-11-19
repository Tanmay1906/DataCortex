import { useState } from 'react';
import { motion } from 'framer-motion';
import SettingsForm from '../components/settings/SettingsForm';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Key,
  CheckCircle,
  AlertTriangle,
  Save
} from 'lucide-react';

const SettingsPage = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setErrorMessage('');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setSuccessMessage('');
    setTimeout(() => setErrorMessage(''), 5000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative"
    >
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center space-x-3">
              <Settings className="w-8 h-8 text-forensics-cyber-400" />
              <span>System Settings</span>
            </h1>
            <p className="text-forensics-slate-300 text-lg">
              Configure your forensics platform preferences and security settings
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-forensics-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Settings Synchronized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Encryption: Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6"
        >
          <div className="glass-card border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-green-300 font-medium">{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6"
        >
          <div className="glass-card border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 font-medium">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Settings Categories</h3>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-forensics-cyber-500/20 border border-forensics-cyber-400/40 text-white'
                        : 'text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold">{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-8">
            {/* Tab Content Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabData?.icon;
                  return (
                    <>
                      <Icon className="w-6 h-6 text-forensics-cyber-400" />
                      <span>{activeTabData?.label} Settings</span>
                    </>
                  );
                })()}
              </h2>
              <p className="text-forensics-slate-300">
                {activeTab === 'profile' && 'Manage your personal information and account preferences'}
                {activeTab === 'security' && 'Configure security settings and authentication methods'}
                {activeTab === 'notifications' && 'Control notification preferences and alert settings'}
                {activeTab === 'system' && 'System-wide configuration and advanced settings'}
              </p>
            </div>

            {/* Settings Form */}
            <SettingsForm
              activeTab={activeTab}
              onSuccess={handleSuccess}
              onError={handleError}
            />

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-forensics-slate-700/50">
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  form="settings-form"
                  className="btn-cyber px-8 py-3 rounded-xl font-semibold tracking-wide flex items-center space-x-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8 glass-card border border-forensics-cyber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-gradient-to-br from-forensics-cyber-500/20 to-forensics-navy-600/20 rounded-xl">
            <Shield className="w-6 h-6 text-forensics-cyber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Security Notice</h3>
            <p className="text-forensics-slate-300 mb-4">
              All settings changes are encrypted and logged for audit purposes. Critical security 
              modifications require additional authentication and are subject to administrator approval.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-forensics-cyber-400">
                <CheckCircle className="w-4 h-4" />
                <span>End-to-end encryption active</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Audit logging enabled</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-400">
                <Key className="w-4 h-4" />
                <span>Multi-factor authentication required</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Database className="w-4 h-4" />
                <span>Settings backed up automatically</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
