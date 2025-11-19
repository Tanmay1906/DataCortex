import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaLock, 
  FaDownload, 
  FaCog, 
  FaShieldAlt, 
  FaSearch, 
  FaFileExport, 
  FaChartBar,
  FaUsers,
  FaDatabase,
  FaCode
} from 'react-icons/fa';

const QuickActionsPanel = ({ 
  variant = 'admin', // 'admin', 'dashboard', 'case'
  onPasswordChange,
  onDownloadBadge,
  onHashVerify,
  customActions = []
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getDefaultActions = () => {
    switch (variant) {
      case 'admin':
        return [
          {
            icon: <FaLock className="w-5 h-5" />,
            title: "Change Password",
            description: "Update your login credentials",
            color: "from-blue-500 to-cyan-600",
            hoverColor: "hover:from-blue-600 hover:to-cyan-700",
            action: onPasswordChange
          },
          {
            icon: <FaDownload className="w-5 h-5" />,
            title: "Download Badge",
            description: "Export digital credentials",
            color: "from-emerald-500 to-green-600",
            hoverColor: "hover:from-emerald-600 hover:to-green-700",
            action: onDownloadBadge
          },
          {
            icon: <FaCog className="w-5 h-5" />,
            title: "Account Settings",
            description: "Manage preferences",
            color: "from-purple-500 to-pink-600",
            hoverColor: "hover:from-purple-600 hover:to-pink-700",
            action: () => navigate('/settings')
          }
        ];

      case 'dashboard':
        return [
          {
            icon: <FaShieldAlt className="w-5 h-5" />,
            title: "Hash Verify",
            description: "Verify file integrity",
            color: "from-amber-500 to-orange-600",
            hoverColor: "hover:from-amber-600 hover:to-orange-700",
            action: onHashVerify
          },
          {
            icon: <FaChartBar className="w-5 h-5" />,
            title: "Reports",
            description: "View case reports",
            color: "from-indigo-500 to-purple-600",
            hoverColor: "hover:from-indigo-600 hover:to-purple-700",
            action: () => navigate('/cases')
          },
          {
            icon: <FaUsers className="w-5 h-5" />,
            title: "User Management",
            description: "Manage team access",
            color: "from-teal-500 to-cyan-600",
            hoverColor: "hover:from-teal-600 hover:to-cyan-700",
            action: () => navigate('/admin'),
            roles: ['admin']
          },
          {
            icon: <FaDatabase className="w-5 h-5" />,
            title: "System Status",
            description: "Check blockchain",
            color: "from-green-500 to-emerald-600",
            hoverColor: "hover:from-green-600 hover:to-emerald-700",
            action: () => navigate('/settings')
          }
        ];

      case 'case':
        return [
          {
            icon: <FaFileExport className="w-5 h-5" />,
            title: "Export Case",
            description: "Generate PDF report",
            color: "from-red-500 to-rose-600",
            hoverColor: "hover:from-red-600 hover:to-rose-700",
            action: () => console.log('Export case')
          },
          {
            icon: <FaSearch className="w-5 h-5" />,
            title: "Search Evidence",
            description: "Find related files",
            color: "from-blue-500 to-indigo-600",
            hoverColor: "hover:from-blue-600 hover:to-indigo-700",
            action: () => navigate('/evidence')
          },
          {
            icon: <FaShieldAlt className="w-5 h-5" />,
            title: "Verify Integrity",
            description: "Check blockchain",
            color: "from-emerald-500 to-green-600",
            hoverColor: "hover:from-emerald-600 hover:to-green-700",
            action: onHashVerify
          }
        ];

      default:
        return [];
    }
  };

  const defaultActions = getDefaultActions();
  const allActions = [...defaultActions, ...customActions];
  
  // Filter actions based on user role
  const filteredActions = allActions.filter(action => {
    if (action.roles && action.roles.length > 0) {
      return action.roles.includes(user?.role);
    }
    return true;
  });

  const getVariantStyles = () => {
    switch (variant) {
      case 'admin':
        return {
          title: 'Quick Actions',
          titleIcon: <FaUsers className="w-4 h-4 text-white" />,
          borderGradient: 'from-emerald-500 via-green-400 to-teal-500',
          iconBg: 'from-emerald-500 to-green-600'
        };
      case 'dashboard':
        return {
          title: 'Quick Tools',
          titleIcon: <FaCode className="w-4 h-4 text-white" />,
          borderGradient: 'from-blue-500 via-cyan-400 to-teal-500',
          iconBg: 'from-blue-500 to-cyan-600'
        };
      case 'case':
        return {
          title: 'Case Actions',
          titleIcon: <FaFileExport className="w-4 h-4 text-white" />,
          borderGradient: 'from-purple-500 via-pink-400 to-red-500',
          iconBg: 'from-purple-500 to-pink-600'
        };
      default:
        return {
          title: 'Quick Actions',
          titleIcon: <FaCog className="w-4 h-4 text-white" />,
          borderGradient: 'from-gray-500 via-slate-400 to-gray-500',
          iconBg: 'from-gray-500 to-slate-600'
        };
    }
  };

  const styles = getVariantStyles();

  if (filteredActions.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Animated top border */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${styles.borderGradient} animate-pulse`}></div>
      
      <h3 className="text-xl font-semibold text-slate-200 mb-6 flex items-center gap-3">
        <div className={`w-8 h-8 bg-gradient-to-br ${styles.iconBg} rounded-lg flex items-center justify-center`}>
          {styles.titleIcon}
        </div>
        {styles.title}
      </h3>
      
      <div className="space-y-3">
        {filteredActions.map((action, index) => (
          <motion.button 
            key={action.title}
            className="w-full group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            disabled={!action.action}
          >
            <div className={`flex items-center p-4 bg-gradient-to-r ${action.color} rounded-xl shadow-lg transition-all duration-300 ${action.hoverColor} group-hover:shadow-xl ${!action.action ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white backdrop-blur-sm">
                  {action.icon}
                </div>
              </div>
              <div className="ml-4 flex-1 text-left">
                <div className="text-sm font-semibold text-white">{action.title}</div>
                <div className="text-xs text-white/80">{action.description}</div>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Floating action indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
    </div>
  );
};

export default QuickActionsPanel;
