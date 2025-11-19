import React from 'react';
import { motion } from 'framer-motion';
import { Shield, LogOut, Search, ShieldCheck, Activity, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="relative bg-gradient-to-r from-forensics-slate-950 via-forensics-navy-950 to-forensics-slate-950 backdrop-blur-xl border-b border-forensics-cyber-500/20 shadow-2xl">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }}
          />
        </div>
        
        {/* Floating Particles */}
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-2 left-1/4 w-24 h-24 bg-forensics-cyber-500/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute top-4 right-1/3 w-32 h-32 bg-forensics-navy-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ x: [-100, window.innerWidth + 100] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-forensics-cyber-400/50 to-transparent"
        />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <motion.div 
            onClick={() => handleNavigation('/dashboard')}
            className="group flex items-center space-x-4 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Logo Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-forensics-cyber-500 to-forensics-navy-600 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-forensics-cyber-600 to-forensics-navy-700 p-4 rounded-2xl border border-forensics-cyber-400/30 shadow-xl group-hover:shadow-forensics-cyber-500/25 transition-all duration-300">
                <Shield className="h-10 w-10 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Status Indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-status-success rounded-full border-2 border-forensics-slate-950 animate-pulse">
                <div className="absolute inset-0.5 bg-status-success/50 rounded-full animate-ping" />
              </div>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-forensics-cyber-300 via-white to-forensics-cyber-300 bg-clip-text text-transparent tracking-tight">
                  DIGITAL FORENSICS
                </span>
                <Zap className="w-5 h-5 text-forensics-cyber-400 animate-pulse" />
              </div>
              <div className="flex items-center space-x-3 text-xs text-forensics-cyber-300/80">
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span className="font-mono tracking-wider uppercase">CYBER INVESTIGATION</span>
                </div>
                <div className="w-1 h-1 bg-forensics-cyber-400 rounded-full animate-pulse" />
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span className="font-mono tracking-wider uppercase">SECURE</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Section */}
          <nav className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Profile Card */}
                <motion.div 
                  className="glass-card px-4 py-3 rounded-xl border border-forensics-cyber-500/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-forensics-cyber-500 to-forensics-navy-600 rounded-xl flex items-center justify-center shadow-lg">
                        <ShieldCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-success rounded-full border-2 border-forensics-slate-950" />
                    </div>
                    <div className="hidden md:flex flex-col">
                      <span className="text-sm font-bold text-white leading-tight">
                        {user.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-forensics-cyber-300 uppercase tracking-wider font-mono">
                          {user.role}
                        </span>
                        <div className="w-1 h-1 bg-forensics-cyber-400 rounded-full" />
                        <span className="text-xs text-green-400 font-mono">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Quick Search */}
                  <motion.button
                    className="p-3 glass-effect rounded-xl border border-forensics-cyber-500/30 text-forensics-cyber-300 hover:text-white hover:border-forensics-cyber-400 transition-all duration-300 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </motion.button>

                  {/* Logout Button */}
                  <motion.button
                    onClick={logout}
                    className="group relative px-6 py-3 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/50 text-red-300 hover:from-red-600/40 hover:to-red-500/40 hover:border-red-400 hover:text-white transition-all duration-300 rounded-xl backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 group-hover:via-red-600/40 transition-all duration-300 rounded-xl" />
                    <div className="relative flex items-center space-x-2">
                      <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold tracking-wide">LOGOUT</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <motion.button
                  onClick={() => handleNavigation('/login')}
                  className="group relative px-6 py-3 text-sm font-bold text-forensics-cyber-300 hover:text-white transition-all duration-300 rounded-xl border border-forensics-cyber-500/30 hover:border-forensics-cyber-400 glass-effect"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-forensics-cyber-600/0 via-forensics-cyber-600/20 to-forensics-cyber-600/0 group-hover:via-forensics-cyber-600/40 transition-all duration-300 rounded-xl" />
                  <span className="relative tracking-wide">ACCESS LOGIN</span>
                </motion.button>

                {/* Register Button */}
                <motion.button
                  onClick={() => handleNavigation('/register')}
                  className="group relative px-6 py-3 text-sm font-bold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-forensics-cyber-600 to-forensics-navy-600 hover:from-forensics-cyber-500 hover:to-forensics-navy-500 shadow-xl hover:shadow-2xl hover:shadow-forensics-cyber-500/25 border border-forensics-cyber-400/30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <span className="relative tracking-wide">REGISTER NOW</span>
                </motion.button>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Bottom Border Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forensics-cyber-400/60 to-transparent" />
      <motion.div
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
          delay: 0.5
        }}
        className="absolute bottom-0 w-32 h-px bg-gradient-to-r from-transparent via-forensics-cyber-400 to-transparent"
      />
    </header>
  );
};

export default Header;
