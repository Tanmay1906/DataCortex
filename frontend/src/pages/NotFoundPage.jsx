import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-forensics-navy-900 via-forensics-slate-900 to-forensics-navy-800" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(8, 145, 178, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(8, 145, 178, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Scanning Line Effect */}
      <div 
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-forensics-cyber-400/50 to-transparent"
        style={{
          top: `${scanLine}%`,
          transition: 'top 0.05s linear'
        }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-forensics-cyber-400 rounded-full opacity-40"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-forensics-cyber-400/30" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-forensics-cyber-400/30" />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-forensics-cyber-500/20 to-forensics-navy-600/20 rounded-full border border-forensics-cyber-500/30">
            <AlertTriangle className="w-12 h-12 text-forensics-cyber-400" />
          </div>

          {/* 404 Number */}
          <h1 className="text-8xl lg:text-9xl font-black text-white mb-6 tracking-wider">
            <span className="cyber-text">404</span>
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Access Denied - Resource Not Found
          </h2>
          
          <p className="text-xl text-forensics-slate-300 leading-relaxed max-w-2xl mx-auto mb-8">
            The requested forensic resource could not be located in our secure database. 
            This may be due to insufficient clearance or the resource has been classified.
          </p>

          {/* Error Code */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-forensics-slate-800/50 border border-forensics-cyber-500/30 rounded-lg mb-8">
            <span className="text-forensics-cyber-400 font-mono text-sm">ERROR CODE:</span>
            <span className="text-white font-mono font-bold">FORENSICS_404_NOT_FOUND</span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <Link to="/dashboard">
            <motion.button
              className="btn-cyber px-8 py-4 rounded-xl font-semibold tracking-wide flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              <span>Return to Command Center</span>
            </motion.button>
          </Link>

          <motion.button
            onClick={() => window.history.back()}
            className="px-8 py-4 glass-effect border border-forensics-slate-600/50 rounded-xl text-forensics-slate-300 hover:text-white hover:border-forensics-slate-500 transition-all duration-300 font-semibold flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </motion.button>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 glass-card border border-forensics-cyber-500/20 rounded-2xl p-6 max-w-2xl mx-auto"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Search className="w-6 h-6 text-forensics-cyber-400" />
            <h3 className="text-xl font-bold text-white">Need Assistance?</h3>
          </div>
          
          <div className="text-left space-y-3 text-forensics-slate-300">
            <p>• Check the URL for any typing errors</p>
            <p>• Ensure you have proper security clearance for this resource</p>
            <p>• Contact your system administrator if you believe this is an error</p>
            <p>• Use the search function to locate the information you need</p>
          </div>

          <div className="mt-6 pt-4 border-t border-forensics-slate-700/50">
            <div className="flex items-center justify-between text-sm text-forensics-slate-400">
              <span>Forensics Security Protocol: ACTIVE</span>
              <span>Incident ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;