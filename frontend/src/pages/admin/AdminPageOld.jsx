import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProfileForm from '../../components/admin/ProfileForm';
import BadgePreview from '../../components/admin/BadgePreview';
import Toast from '../../components/ui/Toast';
import PasswordChangeModal from '../../components/Modals/PasswordChangeModal';
import QuickActionsPanel from '../../components/ui/QuickActionsPanel';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

  // Quick Actions Handlers
  const handleChangePassword = () => {
    setShowPasswordModal(true);
  };

  const handleDownloadBadge = async () => {
    try {
      // Create a simple badge/certificate
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Header
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('DIGITAL CERTIFICATE', canvas.width / 2, 120);

      // Name
      ctx.fillStyle = '#f8fafc';
      ctx.font = '32px Arial';
      ctx.fillText(user?.name || 'User', canvas.width / 2, 200);

      // Role
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px Arial';
      ctx.fillText(`Role: ${user?.role || 'User'}`, canvas.width / 2, 250);

      // Issued date
      ctx.fillText(`Issued: ${new Date().toLocaleDateString()}`, canvas.width / 2, 300);

      // ID
      ctx.fillText(`ID: ${user?.id || 'N/A'}`, canvas.width / 2, 350);

      // Footer
      ctx.fillStyle = '#64748b';
      ctx.font = '18px Arial';
      ctx.fillText('Threat Response Management System', canvas.width / 2, 500);
      ctx.fillText('Digital Evidence Authentication', canvas.width / 2, 530);

      // Download
      const link = document.createElement('a');
      link.download = `badge-${user?.name?.replace(/\s+/g, '_') || 'user'}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setToast({
        type: 'success',
        message: 'Badge downloaded successfully!'
      });
    } catch (error) {
      console.error('Error generating badge:', error);
      setToast({
        type: 'error',
        message: 'Failed to generate badge'
      });
    }
  };

  const handleAccountSettings = () => {
    navigate('/settings');
  };

  const pageVariants = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-16 -left-8 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-24 -right-8 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-8 w-28 h-28 bg-emerald-500 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-2/3 right-4 w-32 h-32 bg-orange-500 rounded-full blur-2xl animate-pulse delay-300"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }}></div>

      <motion.div 
        className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Profile Command Center
              </h1>
              <div className="absolute -top-2 -left-2 w-8 h-8 border-2 border-cyan-400/30 rounded-lg animate-pulse"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
              
              <p className="text-slate-300 text-lg leading-relaxed">
                Manage your digital identity, credentials, and forensic investigator profile.
              </p>
              
              {/* Status indicators */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-400">Profile Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-slate-400">Credentials Valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-600"></div>
                  <span className="text-sm text-slate-400">Security Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Success/Error Messages */}
          {successMessage && (
            <motion.div 
              className="mb-6 relative"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-gradient-to-r from-emerald-600/20 via-green-600/20 to-teal-600/20 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-emerald-300 font-medium">{successMessage}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl animate-pulse"></div>
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div 
              className="mb-6 relative"
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-gradient-to-r from-red-600/20 via-red-600/20 to-orange-600/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-red-300 font-medium">{errorMessage}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl animate-pulse"></div>
              </div>
            </motion.div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Form */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                {/* Animated top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-purple-500 animate-pulse"></div>
                
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Personal Information
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse ml-auto"></div>
                  </h2>
                  <p className="text-slate-400 mt-2">
                    Update your investigator credentials and contact information.
                  </p>
                </div>
                
                <ProfileForm 
                  onSuccess={handleSuccess} 
                  onError={handleError}
                />
              </div>
            </motion.div>

            {/* Sidebar with Badge and Actions */}
            <motion.div className="lg:col-span-1 space-y-6" variants={itemVariants}>
              {/* Badge Preview */}
              <BadgePreview />
              
              {/* Enhanced Quick Actions */}
              <QuickActionsPanel
                variant="admin"
                onPasswordChange={handleChangePassword}
                onDownloadBadge={handleDownloadBadge}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={(message) => {
          setToast({
            type: 'success',
            message: message
          });
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminPage;
