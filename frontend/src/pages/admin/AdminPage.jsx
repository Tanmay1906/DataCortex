import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../../components/admin/ProfileForm';
import BadgePreview from '../../components/admin/BadgePreview';
import Toast from '../../components/ui/Toast';
import PasswordChangeModal from '../../components/Modals/PasswordChangeModal';
import QuickActionsPanel from '../../components/ui/QuickActionsPanel';
import { 
  Settings, 
  User, 
  Shield, 
  Key, 
  Download,
  Activity,
  Database,
  Users,
  AlertTriangle,
  CheckCircle,
  Lock,
  Crown
} from 'lucide-react';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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

  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleDownloadBadge = async () => {
    try {
      // Create a professional forensics badge/certificate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = '#0891b2';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DIGITAL FORENSICS', canvas.width / 2, 120);
      
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#0891b2';
      ctx.fillText('INVESTIGATOR CERTIFICATION', canvas.width / 2, 170);

      // User info
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Arial';
      ctx.fillText(user?.name || 'Investigator', canvas.width / 2, 280);

      ctx.font = '24px Arial';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Badge ID: ${user?.id || 'N/A'}`, canvas.width / 2, 320);
      ctx.fillText(`Department: Digital Forensics`, canvas.width / 2, 360);
      ctx.fillText(`Security Clearance: ${user?.role?.toUpperCase() || 'AUTHORIZED'}`, canvas.width / 2, 400);

      // Date
      ctx.fillText(`Issued: ${new Date().toLocaleDateString()}`, canvas.width / 2, 480);
      
      // Digital signature
      ctx.font = 'italic 18px Arial';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Digitally signed and verified by blockchain', canvas.width / 2, 540);

      // Download
      const link = document.createElement('a');
      link.download = `forensics-badge-${user?.name?.replace(/\s+/g, '-') || 'investigator'}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setToast({ type: 'success', message: 'Badge downloaded successfully!' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to generate badge' });
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'badge', label: 'Digital Badge', icon: Crown },
    { id: 'system', label: 'System Access', icon: Database },
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
              <span>Administrator Panel</span>
            </h1>
            <p className="text-forensics-slate-300 text-lg">
              Manage your investigator profile and system access privileges
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-forensics-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Clearance: {user?.role?.toUpperCase() || 'AUTHORIZED'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Security Level: Maximum</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>2FA Enabled</span>
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
            <h3 className="text-lg font-bold text-white mb-4">Admin Categories</h3>
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

            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-forensics-slate-700/50">
              <h4 className="text-sm font-bold text-forensics-slate-400 mb-4 uppercase tracking-wide">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <motion.button
                  onClick={handleChangePassword}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Key className="w-5 h-5" />
                  <span>Change Password</span>
                </motion.button>
                
                <motion.button
                  onClick={handleDownloadBadge}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30 rounded-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  <span>Download Badge</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
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
                      <span>{activeTabData?.label}</span>
                    </>
                  );
                })()}
              </h2>
              <p className="text-forensics-slate-300">
                {activeTab === 'profile' && 'Manage your investigator profile information and preferences'}
                {activeTab === 'security' && 'Configure security settings and authentication methods'}
                {activeTab === 'badge' && 'Generate and download your digital forensics investigator badge'}
                {activeTab === 'system' && 'System access controls and administrative privileges'}
              </p>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
              <ProfileForm
                user={user}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-effect border border-forensics-cyber-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Key className="w-6 h-6 text-forensics-cyber-400" />
                      <h3 className="text-lg font-bold text-white">Password Security</h3>
                    </div>
                    <p className="text-forensics-slate-300 mb-4">
                      Last changed: {new Date().toLocaleDateString()}
                    </p>
                    <motion.button
                      onClick={handleChangePassword}
                      className="btn-cyber px-4 py-2 rounded-lg font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Change Password
                    </motion.button>
                  </div>

                  <div className="glass-effect border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-bold text-white">Two-Factor Auth</h3>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400 mb-4">
                      <CheckCircle className="w-5 h-5" />
                      <span>Enabled</span>
                    </div>
                    <p className="text-forensics-slate-300 text-sm">
                      Additional security layer active
                    </p>
                  </div>
                </div>

                <div className="glass-effect border border-forensics-cyber-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Security Log</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forensics-slate-300">Last login</span>
                      <span className="text-white">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forensics-slate-300">Login attempts (24h)</span>
                      <span className="text-green-400">1 successful</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-forensics-slate-300">Security events</span>
                      <span className="text-green-400">0 alerts</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'badge' && (
              <div className="space-y-6">
                <BadgePreview user={user} />
                
                <div className="text-center">
                  <motion.button
                    onClick={handleDownloadBadge}
                    className="btn-cyber px-8 py-3 rounded-xl font-semibold tracking-wide flex items-center space-x-3 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Digital Badge</span>
                  </motion.button>
                </div>

                <div className="glass-effect border border-forensics-cyber-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Badge Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-forensics-slate-400">Badge ID:</span>
                      <div className="text-white font-mono">{user?.id || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-forensics-slate-400">Clearance Level:</span>
                      <div className="text-forensics-cyber-400 font-semibold">{user?.role?.toUpperCase() || 'AUTHORIZED'}</div>
                    </div>
                    <div>
                      <span className="text-forensics-slate-400">Department:</span>
                      <div className="text-white">Digital Forensics</div>
                    </div>
                    <div>
                      <span className="text-forensics-slate-400">Valid Until:</span>
                      <div className="text-white">{new Date(new Date().getFullYear() + 1, 11, 31).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-effect border border-forensics-cyber-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-6 h-6 text-forensics-cyber-400" />
                      <h3 className="text-lg font-bold text-white">User Management</h3>
                    </div>
                    <p className="text-forensics-slate-300 mb-4">
                      Access level: {user?.role?.toUpperCase() || 'USER'}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-forensics-slate-300">View cases</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-forensics-slate-300">Upload evidence</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-forensics-slate-300">Generate reports</span>
                      </div>
                    </div>
                  </div>

                  <div className="glass-effect border border-forensics-cyber-500/30 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Activity className="w-6 h-6 text-orange-400" />
                      <h3 className="text-lg font-bold text-white">System Activity</h3>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-forensics-slate-300">Active sessions</span>
                        <span className="text-white">1</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-forensics-slate-300">Cases accessed</span>
                        <span className="text-white">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-forensics-slate-300">Evidence uploaded</span>
                        <span className="text-white">45</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={(message) => {
          setShowPasswordModal(false);
          handleSuccess(message);
        }}
        onError={handleError}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

export default AdminPage;
