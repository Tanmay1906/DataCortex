import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import CaseTable from '../components/CaseTable';
import ActivityFeed from '../components/ActivityFeed';
import { 
  Shield, 
  Bell, 
  Search, 
  Plus, 
  AlertTriangle, 
  Activity, 
  Database, 
  ExternalLink, 
  Eye, 
  Users, 
  Clock,
  TrendingUp,
  FileText,
  Zap,
  BarChart3,
  PieChart,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import HashVerificationModal from '../components/Modals/HashVerificationModal';
import Loader from '../components/ui/Loader';

// Utility function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMs = now - time;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return time.toLocaleDateString();
};

const StatCard = ({ icon: Icon, title, value, change, trend, color, description }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-6 border border-forensics-cyber-500/20 rounded-2xl group card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-white group-hover:text-forensics-cyber-300 transition-colors duration-300">
          {value}
        </h3>
        <p className="text-sm font-semibold text-forensics-slate-300 group-hover:text-white transition-colors duration-300">
          {title}
        </p>
        {description && (
          <p className="text-xs text-forensics-slate-400 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
    </motion.div>
  );
};

const QuickActionCard = ({ icon: Icon, title, description, onClick, color }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card p-6 border border-forensics-cyber-500/20 rounded-2xl text-left group hover:border-forensics-cyber-400/50 transition-all duration-300"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 w-fit`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-lg font-bold text-white group-hover:text-forensics-cyber-300 transition-colors duration-300 mb-2">
        {title}
      </h3>
      <p className="text-sm text-forensics-slate-400 group-hover:text-forensics-slate-300 transition-colors duration-300">
        {description}
      </p>
      
      <div className="mt-4 flex items-center text-forensics-cyber-400 group-hover:text-forensics-cyber-300 transition-colors duration-300">
        <span className="text-sm font-semibold">Get Started</span>
        <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </motion.button>
  );
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({
    active_cases: 0,
    total_evidence: 0,
    blockchain_txs: 0,
    blockchain_status: 'disconnected'
  });
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsApiAvailable, setNotificationsApiAvailable] = useState(null);
  const [showHashVerification, setShowHashVerification] = useState(false);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [casesRes, statsRes, activityRes] = await Promise.all([
          api.get('/dashboard/cases'),
          api.get('/dashboard/stats'),
          api.get('/dashboard/activity')
        ]);
        
        setCases(Array.isArray(casesRes.data) ? casesRes.data : []);
        setStats(statsRes.data || {});
        setActivity(Array.isArray(activityRes.data) ? activityRes.data : []);
        
        // Fetch real notifications for case creation and evidence uploads
        if (notificationsApiAvailable !== false) {
          try {
            const notificationsRes = await api.get('/notifications');
            const realNotifications = Array.isArray(notificationsRes.data) ? notificationsRes.data : [];
            
            // Mark API as available
            setNotificationsApiAvailable(true);
            
            // Add mock security and attack notifications
            const mockSecurityNotifications = [
              {
                id: 'mock_security_1',
                type: 'security_alert',
                title: 'Security Alert',
                message: 'Suspicious login attempt detected from IP 192.168.1.100',
                timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                read: false,
                priority: 'high'
              },
              {
                id: 'mock_attack_1',
                type: 'system_attack',
                title: 'Attack Detected',
                message: 'Brute force attack detected on evidence server',
                timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
                read: false,
                priority: 'critical'
              },
              {
                id: 'mock_blockchain_1',
                type: 'blockchain_sync',
                title: 'Blockchain Sync',
                message: 'Evidence hash successfully recorded on blockchain',
                timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
                read: true,
                priority: 'low'
              }
            ];
            
            // Combine real and mock notifications
            setNotifications([...realNotifications, ...mockSecurityNotifications]);
          } catch (notificationError) {
            console.warn('Notifications API not available, using mock data only');
            // Mark API as unavailable to prevent future calls
            setNotificationsApiAvailable(false);
            
            // Use only mock data since API is not available
            setNotifications([
              {
                id: 'mock_case_1',
                type: 'case_created',
                title: 'New Case Created',
                message: 'Case #2024-001 "Data Breach Investigation" has been created',
                timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
                read: false,
                priority: 'medium'
              },
              {
                id: 'mock_evidence_1',
                type: 'evidence_uploaded',
                title: 'Evidence Uploaded',
                message: 'Digital forensic image uploaded to Case #2024-001',
                timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                read: false,
                priority: 'medium'
              },
              {
                id: 'mock_security_1',
                type: 'security_alert',
                title: 'Security Alert',
                message: 'Suspicious login attempt detected from IP 192.168.1.100',
                timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                read: false,
                priority: 'high'
              },
              {
                id: 'mock_blockchain_1',
                type: 'blockchain_sync',
                title: 'Blockchain Sync',
                message: 'Evidence hash successfully recorded on blockchain',
                timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
                read: true,
                priority: 'low'
              },
              {
                id: 'mock_attack_1',
                type: 'system_attack',
                title: 'Attack Detected',
                message: 'Brute force attack detected on evidence server',
                timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
                read: false,
                priority: 'critical'
              }
            ]);
          }
        } else {
          // API is known to be unavailable, use mock data
          setNotifications([
            {
              id: 'mock_case_1',
              type: 'case_created',
              title: 'New Case Created',
              message: 'Case #2024-001 "Data Breach Investigation" has been created',
              timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
              read: false,
              priority: 'medium'
            },
            {
              id: 'mock_evidence_1',
              type: 'evidence_uploaded',
              title: 'Evidence Uploaded',
              message: 'Digital forensic image uploaded to Case #2024-001',
              timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
              read: false,
              priority: 'medium'
            },
            {
              id: 'mock_security_1',
              type: 'security_alert',
              title: 'Security Alert',
              message: 'Suspicious login attempt detected from IP 192.168.1.100',
              timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
              read: false,
              priority: 'high'
            },
            {
              id: 'mock_blockchain_1',
              type: 'blockchain_sync',
              title: 'Blockchain Sync',
              message: 'Evidence hash successfully recorded on blockchain',
              timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
              read: true,
              priority: 'low'
            },
            {
              id: 'mock_attack_1',
              type: 'system_attack',
              title: 'Attack Detected',
              message: 'Brute force attack detected on evidence server',
              timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
              read: false,
              priority: 'critical'
            }
          ]);
        }
      } catch (error) {
        console.error('Dashboard load error:', error);
        setError(error.message || 'Failed to load dashboard data');
        // Set default values on error
        setCases([]);
        setStats({
          active_cases: 0,
          total_evidence: 0,
          blockchain_txs: 0,
          blockchain_status: 'disconnected'
        });
        setActivity([]);
        setNotifications([]);
        
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token, logout, navigate]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return (
      <Loader 
        variant="forensics" 
        size="large" 
        message="Loading Forensic Dashboard..."
        subMessage="Securing connection & verifying credentials"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-500/20 border-2 border-red-500/40 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
          </div>
          <h2 className="text-red-100 text-xl font-bold mb-3">Connection Error</h2>
          <p className="text-red-300 text-sm mb-6">{error}</p>
          <p className="text-gray-400 text-xs mb-6">Please ensure the backend server is running on port 5000</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 rounded-lg font-medium transition-all duration-200"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Filter cases based on search query - ensure cases is an array
  const filteredCases = Array.isArray(cases) ? cases.filter(caseItem => 
    (caseItem.case_number || caseItem.id || '').toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    (caseItem.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (caseItem.status || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Handle case creation permission based on user role
  const canCreateCase = ['admin', 'investigator'].includes(user.role);

  // Notification functions
  const unreadNotifications = notifications.filter(n => !n.read);
  const markNotificationAsRead = async (notificationId) => {
    // Update local state immediately for better UX
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    
    // Only make API call for real notifications if API is available
    if (notificationsApiAvailable && !String(notificationId).startsWith('mock_')) {
      try {
        await api.patch(`/notifications/${notificationId}/read`);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        // Revert the local state change if API call fails
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: false } : n)
        );
      }
    }
  };

  const markAllNotificationsAsRead = async () => {
    // Update local state immediately
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // Only make API calls if notifications API is available
    if (notificationsApiAvailable) {
      // Get all real notification IDs (excluding mock ones)
      const realNotificationIds = notifications
        .filter(n => !String(n.id).startsWith('mock_'))
        .map(n => n.id);
      
      if (realNotificationIds.length > 0) {
        try {
          await api.patch('/notifications/mark-all-read', { 
            notificationIds: realNotificationIds 
          });
        } catch (error) {
          console.error('Failed to mark all notifications as read:', error);
          // Revert the local state change if API call fails
          setNotifications(prev => 
            prev.map(n => 
              String(n.id).startsWith('mock_') ? { ...n, read: true } : { ...n, read: false }
            )
          );
        }
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'case_created': return '📁';
      case 'evidence_uploaded': return '📄';
      case 'security_alert': return '⚠️';
      case 'system_attack': return '🚨';
      case 'blockchain_sync': return '🔗';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen relative bg-gradient-to-br from-slate-900 via-forensics-cyber-900 to-blue-950 overflow-x-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(0,255,255,0.08) 0, transparent 70%), radial-gradient(circle at 80% 80%, rgba(0,0,255,0.08) 0, transparent 70%)' }}
    >
      {/* Premium Header with Glow & Avatar */}
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 px-2"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 shadow-2xl flex items-center justify-center text-3xl font-black text-white border-4 border-forensics-cyber-500 animate-avatar-glow">
                {user.name?.charAt(0) || 'U'}
              </div>
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-1 tracking-tight">
                Welcome, <span className="cyber-text text-forensics-cyber-400 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>
              </h1>
              <p className="text-forensics-slate-300 text-lg font-medium">Digital Forensics Command Center</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-forensics-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Security: <span className="font-bold text-forensics-cyber-300">Maximum</span></span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 glass-effect rounded-xl border border-forensics-cyber-500/30 hover:border-forensics-cyber-400 transition-colors duration-300 shadow-lg"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <Bell className="w-5 h-5 text-forensics-cyber-300" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-md animate-pulse"
                  >
                    {notifications.filter(n => !n.read).length}
                  </motion.div>
                )}
              </motion.button>
            </div>
            {/* Quick Actions */}
            <motion.button
              onClick={() => navigate('/cases/new')}
              className="btn-cyber px-7 py-3 rounded-xl font-semibold tracking-wide flex items-center gap-2 shadow-lg bg-gradient-to-r from-forensics-cyber-500 to-blue-600 hover:from-blue-600 hover:to-forensics-cyber-500 text-white"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <Plus className="w-5 h-5" />
              <span>New Case</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      /* Stats Grid - Enhanced Glassmorphism & Glow */
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 px-2"
      >
        <StatCard
          icon={Shield}
          title="Active Cases"
          value={stats.active_cases || 1}
          change={stats.active_cases_change || "+0%"}
          trend={stats.active_cases_trend || "stable"}
          color="from-forensics-cyber-500 to-forensics-navy-600"
          description="Currently under investigation"
        />
        <StatCard
          icon={Database}
          title="Evidence Files"
          value={stats.total_evidence || 0}
          change={stats.total_evidence_change || "+0%"}
          trend={stats.total_evidence_trend || "stable"}
          color="from-emerald-500 to-teal-600"
          description="Securely stored and verified"
        />
        <StatCard
          icon={Activity}
          title="Blockchain TXs"
          value={stats.blockchain_txs || 0}
          change={stats.blockchain_txs_change || "+0%"}
          trend={stats.blockchain_txs_trend || "stable"}
          color="from-orange-500 to-amber-600"
          description="Chain of custody entries"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={stats.active_users || 1}
          change={stats.active_users_change || "+0%"}
          trend={stats.active_users_trend || "stable"}
          color="from-purple-500 to-violet-600"
          description="Online investigators"
        />
      </motion.div>

      {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-2">
        {/* Left Column - Cases & Quick Actions */}
  <div className="lg:col-span-2 space-y-10">
          {/* Recent Cases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="glass-card p-8 border-2 border-forensics-cyber-500/30 rounded-3xl shadow-xl backdrop-blur-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-forensics-cyber-400" />
                  <span>Recent Cases</span>
                </h2>
                <p className="text-forensics-slate-400 mt-1">Latest investigative activities</p>
              </div>
              <Link
                to="/cases"
                className="flex items-center space-x-2 text-forensics-cyber-400 hover:text-forensics-cyber-300 transition-colors duration-300"
              >
                <span className="text-sm font-semibold">View All</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="loading-pulse h-16 bg-forensics-slate-800/50 rounded-xl" />
                ))}
              </div>
            ) : (
              <CaseTable cases={cases.slice(0, 5)} />
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <QuickActionCard
              icon={Plus}
              title="Create New Case"
              description="Start a new forensic investigation with secure evidence tracking"
              onClick={() => navigate('/cases/new')}
              color="from-forensics-cyber-500 to-forensics-navy-600"
            />
            <QuickActionCard
              icon={Database}
              title="Upload Evidence"
              description="Securely upload digital evidence with blockchain verification"
              onClick={() => navigate('/upload-evidence')}
              color="from-emerald-500 to-teal-600"
            />
            <QuickActionCard
              icon={BarChart3}
              title="View Analytics"
              description="Analyze case progress and system performance metrics"
              onClick={() => navigate('/analytics')}
              color="from-orange-500 to-amber-600"
            />
            <QuickActionCard
              icon={Shield}
              title="Security Center"
              description="Monitor system security and audit trails"
              onClick={() => setShowHashVerification(true)}
              color="from-purple-500 to-violet-600"
            />
          </motion.div>
        </div>

        {/* Right Column - Activity & System Status */}
  <div className="space-y-10">
          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="glass-card p-8 border-2 border-forensics-cyber-500/30 rounded-3xl shadow-xl backdrop-blur-lg"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-3">
              <Activity className="w-5 h-5 text-green-400" />
              <span>System Status</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-semibold">Blockchain Network</p>
                    <p className="text-green-300 text-sm">{stats.blockchain_status === 'connected' ? 'Connected' : 'Syncing...'}</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-forensics-slate-800/30 border border-forensics-slate-600/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-forensics-cyber-400" />
                  <div>
                    <p className="text-white font-semibold">Security Level</p>
                    <p className="text-forensics-slate-300 text-sm">Maximum Protection</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-forensics-cyber-400 rounded-full animate-pulse" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-blue-400 font-semibold">Evidence Storage</p>
                    <p className="text-blue-300 text-sm">92% Available</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="glass-card p-8 border-2 border-forensics-cyber-500/30 rounded-3xl shadow-xl backdrop-blur-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center space-x-3">
                <Clock className="w-5 h-5 text-forensics-cyber-400" />
                <span>Recent Activity</span>
              </h3>
              <button className="text-forensics-cyber-400 hover:text-forensics-cyber-300 transition-colors duration-300">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="loading-pulse h-12 bg-forensics-slate-800/50 rounded-lg" />
                ))}
              </div>
            ) : (
              <ActivityFeed activities={activity.slice(0, 6)} />
            )}
          </motion.div>
        </div>
      </div>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-24 right-8 z-50 w-96 glass-card border-2 border-forensics-cyber-500/40 rounded-3xl p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-white tracking-tight">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-forensics-slate-400 hover:text-white transition-colors duration-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={`p-4 rounded-xl border-2 ${
                      notification.read 
                        ? 'bg-forensics-slate-800/30 border-forensics-slate-600/20' 
                        : 'bg-forensics-cyber-500/10 border-forensics-cyber-500/30 shadow-md'
                    } hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        notification.priority === 'critical' ? 'bg-red-500 animate-pulse' :
                        notification.priority === 'high' ? 'bg-orange-400 animate-pulse' :
                        notification.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-bold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 animate-pulse"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTimestamp(notification.timestamp)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="pt-4 text-center">
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-semibold">View all notifications</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hash Verification Modal */}
      {showHashVerification && (
        <HashVerificationModal
          isOpen={showHashVerification}
          onClose={() => setShowHashVerification(false)}
        />
      )}
    </motion.div>
  );
        {/* Top Bar with Search and Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="text-white font-semibold text-lg">{user.name}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {canCreateCase && (
                <Link 
                  to="/cases/new" 
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-green-500/25 group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                  <span>New Case</span>
                </Link>
              )}
              
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-all duration-200 border border-white/10"
                >
                  <Bell className="w-5 h-5 text-white" />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-white font-semibold">Notifications</h3>
                      <div className="flex items-center space-x-2">
                        {unreadNotifications.length > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-500/10' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${getPriorityColor(notification.priority)}`}>
                                <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className={`text-sm font-medium ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                  {formatTimestamp(notification.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-white/10 text-center">
                        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white rounded-lg text-sm font-medium transition-all duration-200 border border-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cases, evidence, or blockchain hashes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
              Ctrl+K
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Activity className="w-6 h-6 text-blue-300" />
              </div>
              <span className="text-green-400 text-sm font-medium bg-green-400/20 px-2 py-1 rounded-full">
                +2 today
              </span>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats.active_cases || '12'}</div>
            <div className="text-blue-200 font-medium">Active Cases</div>
            <div className="text-orange-300 text-sm mt-2">3 High Priority</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-400/20 rounded-2xl p-6 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Database className="w-6 h-6 text-purple-300" />
              </div>
              <span className="text-green-400 text-sm font-medium bg-green-400/20 px-2 py-1 rounded-full">
                +5 today
              </span>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats.total_evidence || '847'}</div>
            <div className="text-purple-200 font-medium">Evidence Items</div>
            <div className="text-green-300 text-sm mt-2">All Verified</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl border border-emerald-400/20 rounded-2xl p-6 hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <ExternalLink className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm">Live</span>
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-2">{stats.blockchain_txs || '1,204'}</div>
            <div className="text-emerald-200 font-medium">Blockchain TXs</div>
            <div className="text-green-300 text-sm mt-2">Ganache Connected</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl border border-orange-400/20 rounded-2xl p-6 hover:from-orange-500/30 hover:to-orange-600/30 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/30 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Users className="w-6 h-6 text-orange-300" />
              </div>
              <span className="text-blue-400 text-sm font-medium bg-blue-400/20 px-2 py-1 rounded-full">
                Online
              </span>
            </div>
            <div className="text-3xl font-black text-white mb-2">8</div>
            <div className="text-orange-200 font-medium">Active Investigators</div>
            <div className="text-blue-300 text-sm mt-2">2 Admins</div>
          </div>
        </div>

        {/* Case Overview - Full Width with Enhanced Styling */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-slate-800/80 via-blue-900/60 to-slate-800/80 backdrop-blur-xl border-2 border-blue-400/30 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-blue-500/20">
            {/* Enhanced Header with Gradient and Glow Effect */}
            <div className="px-8 py-8 border-b-2 border-blue-400/20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 relative">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-blue-500/5 blur-xl"></div>
              
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl border border-blue-400/30 shadow-lg">
                    <Eye className="w-6 h-6 text-blue-200" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Case Overview</h2>
                    <p className="text-blue-200 text-sm font-medium">Active investigations & digital evidence</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-white/15 text-white rounded-xl text-sm font-medium hover:bg-white/25 transition-all duration-200 border border-white/20 backdrop-blur-sm">
                    Filter Cases
                  </button>
                  {canCreateCase && (
                    <Link 
                      to="/cases/new" 
                      className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 border border-blue-400/30"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Case</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            
            {/* Case Table with Enhanced Background */}
            <div className="px-0 bg-gradient-to-b from-slate-900/50 to-slate-800/50">
              <CaseTable cases={filteredCases} />
            </div>
          </div>
        </div>

        {/* Activity Feed & System Status - Enhanced with Different Color Scheme */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity - Green Theme */}
          <div className="bg-gradient-to-br from-emerald-900/40 via-green-800/30 to-emerald-900/40 backdrop-blur-xl border border-emerald-400/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-emerald-400/20 bg-gradient-to-r from-emerald-600/15 to-green-600/15">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
                  <Clock className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-100">Live Activity</h3>
                  <p className="text-emerald-300 text-sm">Real-time system updates</p>
                </div>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto bg-gradient-to-b from-emerald-950/30 to-green-950/20">
              <ActivityFeed items={activity} />
            </div>
          </div>

          {/* System Status Panel - Orange Theme */}
          <div className="bg-gradient-to-br from-orange-900/40 via-amber-800/30 to-orange-900/40 backdrop-blur-xl border border-orange-400/20 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2.5 bg-orange-500/20 rounded-xl border border-orange-400/30">
                <Shield className="w-5 h-5 text-orange-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-orange-100">System Status</h3>
                <p className="text-orange-300 text-sm">Infrastructure health monitor</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-200 font-medium">Database</span>
                </div>
                <span className="text-green-300 text-sm font-semibold">Online</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-200 font-medium">Blockchain API</span>
                </div>
                <span className="text-green-300 text-sm font-semibold">Connected</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-200 font-medium">Storage</span>
                </div>
                <span className="text-amber-300 text-sm font-semibold">85% Used</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 pt-4 border-t border-orange-400/20">
              <h4 className="text-orange-100 font-semibold mb-3">Quick Tools</h4>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowHashVerification(true)}
                  className="p-3 bg-orange-500/15 hover:bg-orange-500/25 rounded-lg text-center text-orange-200 text-sm font-medium transition-all duration-200 border border-orange-400/20 hover:border-orange-400/40 transform hover:scale-105"
                >
                  Hash Verify
                </button>
                <button 
                  onClick={() => navigate('/cases')}
                  className="p-3 bg-orange-500/15 hover:bg-orange-500/25 rounded-lg text-center text-orange-200 text-sm font-medium transition-all duration-200 border border-orange-400/20 hover:border-orange-400/40 transform hover:scale-105"
                >
                  Reports
                </button>
              </div>
            </div>
          </div>
        </div>
};

export default DashboardPage;