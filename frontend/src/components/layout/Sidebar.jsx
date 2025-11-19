import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  Upload, 
  Settings, 
  Shield, 
  Activity,
  ChevronRight,
  Zap,
  Database,
  Users,
  FileText,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      roles: ['admin', 'investigator', 'user'],
      description: 'Overview & Analytics',
      color: 'from-forensics-cyber-500 to-forensics-navy-500',
      hoverColor: 'from-forensics-cyber-400 to-forensics-navy-400',
      stats: '4 Active',
    },
    {
      id: 'cases',
      name: 'Cases',
      path: '/cases',
      icon: FolderOpen,
      roles: ['admin', 'investigator', 'user'],
      description: 'Active Investigations',
      color: 'from-emerald-500 to-teal-500',
      hoverColor: 'from-emerald-400 to-teal-400',
      stats: '12 Open',
    },
    {
      id: 'evidence',
      name: 'Evidence',
      path: '/evidence',
      icon: Database,
      roles: ['admin', 'investigator', 'user'],
      description: 'Digital Evidence Hub',
      color: 'from-orange-500 to-amber-500',
      hoverColor: 'from-orange-400 to-amber-400',
      stats: '156 Files',
    },
    {
      id: 'upload',
      name: 'Upload Evidence',
      path: '/upload-evidence',
      icon: Upload,
      roles: ['admin', 'investigator', 'user'],
      description: 'Secure File Upload',
      color: 'from-purple-500 to-violet-500',
      hoverColor: 'from-purple-400 to-violet-400',
      stats: 'Secure',
    },
    {
      id: 'admin',
      name: 'Profile',
      path: '/admin',
      icon: Settings,
      roles: ['admin', 'investigator', 'user'],
      description: 'User Management',
      color: 'from-blue-500 to-indigo-500',
      hoverColor: 'from-blue-400 to-indigo-400',
      stats: 'Profile',
    },
  ];

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const sidebarVariants = {
    expanded: { width: '280px' },
    collapsed: { width: '80px' }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    })
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-full glass-card border-r border-forensics-cyber-500/20 overflow-hidden group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2306b6d4' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H4V6h16V3.5c0-1.7 1.3-3 3-3s3 1.3 3 3V6h16v12H26v2.5c0 1.7-1.3 3-3 3s-3-1.3-3-3zM10 8v4h12V8H10zm16 12v4h12v-4H26z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      {/* Sidebar Header */}
      <div className="relative p-6 border-b border-forensics-cyber-500/20">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-forensics-cyber-500 to-forensics-navy-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Navigation</h2>
                <p className="text-xs text-forensics-cyber-300">Digital Forensics</p>
              </div>
            </motion.div>
          )}
          
          <motion.button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg glass-effect border border-forensics-cyber-500/30 hover:border-forensics-cyber-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="w-4 h-4 text-forensics-cyber-300" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-2">
        <AnimatePresence>
          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map((item, index) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              
              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      relative w-full group/item overflow-hidden rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg border border-white/20' 
                        : 'glass-effect border border-forensics-cyber-500/20 text-forensics-slate-300 hover:text-white hover:border-forensics-cyber-400'
                      }
                      ${isCollapsed ? 'p-3' : 'p-4'}
                    `}
                    whileHover={{ 
                      scale: 1.02,
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Background Animation */}
                    {!isActive && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${item.hoverColor} opacity-0 group-hover/item:opacity-20 transition-opacity duration-300 rounded-xl`}
                      />
                    )}

                    {/* Scan Line Effect */}
                    {hoveredItem === item.id && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    )}

                    <div className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                      {/* Icon */}
                      <div className={`
                        flex items-center justify-center rounded-lg transition-all duration-300
                        ${isActive 
                          ? 'bg-white/20 p-2' 
                          : 'group-hover/item:bg-white/10 p-2'
                        }
                      `}>
                        <Icon className={`
                          transition-all duration-300
                          ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}
                          ${isActive ? 'text-white' : 'text-forensics-cyber-300 group-hover/item:text-white'}
                          ${hoveredItem === item.id ? 'rotate-12' : ''}
                        `} />
                      </div>

                      {/* Text Content */}
                      {!isCollapsed && (
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm tracking-wide">
                              {item.name}
                            </span>
                            {item.stats && (
                              <span className={`
                                text-xs font-mono px-2 py-1 rounded-md
                                ${isActive 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-forensics-slate-800/50 text-forensics-cyan-300'
                                }
                              `}>
                                {item.stats}
                              </span>
                            )}
                          </div>
                          <p className={`
                            text-xs mt-1 transition-colors duration-300
                            ${isActive 
                              ? 'text-white/80' 
                              : 'text-forensics-slate-400 group-hover/item:text-forensics-cyan-300'
                            }
                          `}>
                            {item.description}
                          </p>
                        </div>
                      )}

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute right-0 top-1/2 w-1 h-8 bg-white rounded-l-full"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </nav>

      {/* Status Panel */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 right-4"
        >
          <div className="glass-card p-4 border border-forensics-cyber-500/30 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">System Status</h3>
                <p className="text-xs text-green-400">All Systems Online</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-forensics-slate-300">Security Level</span>
                <span className="text-green-400 font-mono">SECURE</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-forensics-slate-300">Blockchain</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-mono">SYNCED</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Collapse Hint */}
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white animate-pulse" />
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;