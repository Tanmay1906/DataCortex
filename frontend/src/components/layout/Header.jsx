import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Search, 
  Settings, 
  LogOut, 
  User, 
  Shield, 
  Home,
  FolderOpen,
  Upload,
  Database,
  Activity,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      description: 'Overview & Analytics'
    },
    {
      name: 'Cases',
      path: '/cases',
      icon: FolderOpen,
      description: 'Active Investigations'
    },
    {
      name: 'Evidence',
      path: '/evidence',
      icon: Database,
      description: 'Digital Evidence'
    },
    {
      name: 'Upload',
      path: '/upload',
      icon: Upload,
      description: 'Upload Evidence'
    },
    {
      name: 'Activity',
      path: '/chain-of-custody',
      icon: Activity,
      description: 'Chain of Custody'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 glass-effect border-b border-forensics-cyber-500/20 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-forensics-cyber-400 to-forensics-navy-500 rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-forensics-cyber-400/20 to-forensics-navy-500/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-black bg-gradient-to-r from-white to-forensics-cyber-300 bg-clip-text text-transparent">
                    DataCortex
                  </h1>
                  <p className="text-xs text-forensics-slate-400 -mt-1">
                    Digital Investigation Platform
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="group relative"
                    >
                      <motion.div
                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-forensics-cyber-500/20 text-forensics-cyber-300 border border-forensics-cyber-500/30'
                            : 'text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-semibold">{item.name}</span>
                      </motion.div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-forensics-cyber-400 rounded-full"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forensics-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 glass-effect border border-forensics-cyber-500/20 rounded-xl text-white placeholder-forensics-slate-400 focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                />
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-2 glass-effect border border-forensics-cyber-500/20 rounded-xl hover:border-forensics-cyber-400 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-forensics-cyber-400 to-forensics-navy-500 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-white">{user?.name || 'Investigator'}</p>
                    <p className="text-xs text-forensics-slate-400">{user?.role || 'User'}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-forensics-slate-400 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 glass-card border border-forensics-cyber-500/30 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-forensics-slate-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-forensics-cyber-400 to-forensics-navy-500 rounded-xl flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{user?.name || 'Investigator'}</p>
                            <p className="text-sm text-forensics-slate-400">{user?.email || 'investigator@forensics.lab'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span className="text-xs text-green-400">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 w-full px-3 py-2 text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30 rounded-xl transition-all duration-300"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Account Settings</span>
                        </Link>
                        
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 glass-effect border border-forensics-cyber-500/20 rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showMobileMenu ? (
                  <X className="w-5 h-5 text-forensics-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-forensics-slate-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-forensics-cyber-500/20 glass-effect"
            >
              <div className="container mx-auto px-4 py-4">
                {/* Mobile Search */}
                <div className="mb-4 md:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forensics-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full glass-effect border border-forensics-cyber-500/20 rounded-xl text-white placeholder-forensics-slate-400 focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Mobile Navigation Items */}
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActivePath(item.path);
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? 'bg-forensics-cyber-500/20 text-forensics-cyber-300 border border-forensics-cyber-500/30'
                            : 'text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30'
                        }`}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-xs text-forensics-slate-400">{item.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Professional Status Bar */}
      <div className="glass-effect border-b border-forensics-cyber-500/10 py-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs text-forensics-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>System Operational</span>
              </div>
              <span>•</span>
              <span>Security Level: Maximum</span>
              <span>•</span>
              <span>Last Sync: {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>Version 2.0.0</span>
              <span>•</span>
              <span>Blockchain Verified</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
