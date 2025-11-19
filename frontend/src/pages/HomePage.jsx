import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Database, 
  Lock, 
  Activity, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Users,
  Globe,
  FileText,
  Search,
  Clock
} from 'lucide-react';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen relative"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forensics-navy-900 via-forensics-slate-900 to-forensics-navy-800" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(8, 145, 178, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)`
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-forensics-cyber-400 rounded-full opacity-60"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0.3, 1, 0.3],
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

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              <span className="block">DIGITAL</span>
              <span className="block cyber-text">FORENSICS</span>
              <span className="block text-4xl lg:text-5xl font-bold text-forensics-slate-300 mt-2">
                COMMAND CENTER
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-forensics-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              International-grade digital forensics platform with blockchain verification, 
              secure evidence management, and complete chain of custody tracking
            </p>

            <div className="flex items-center justify-center space-x-6 mb-12 text-sm text-forensics-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>ISO 27001 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-forensics-cyber-400" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>International Standards</span>
              </div>
            </div>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/auth">
                  <motion.button
                    className="btn-cyber px-8 py-4 rounded-xl font-bold text-lg tracking-wide flex items-center space-x-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <motion.button
                  className="px-8 py-4 glass-effect border border-forensics-slate-600/50 rounded-xl text-forensics-slate-300 hover:text-white hover:border-forensics-slate-500 transition-all duration-300 font-semibold text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More
                </motion.button>
              </div>
            ) : (
              <Link to="/dashboard">
                <motion.button
                  className="btn-cyber px-8 py-4 rounded-xl font-bold text-lg tracking-wide flex items-center space-x-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-b from-forensics-slate-900 to-forensics-navy-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-forensics-slate-300 max-w-3xl mx-auto">
              Advanced digital forensics capabilities designed for international law enforcement, 
              corporate security teams, and forensic investigators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-8 hover:border-forensics-cyber-400/40 transition-all duration-300"
            >
              <div className="p-4 bg-gradient-to-br from-forensics-cyber-500/20 to-forensics-navy-600/20 rounded-xl w-fit mb-6">
                <Shield className="w-8 h-8 text-forensics-cyber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Blockchain Security</h3>
              <p className="text-forensics-slate-300 mb-6">
                Immutable evidence integrity with SHA256 hashing and blockchain verification. 
                Every piece of evidence is cryptographically secured and timestamped.
              </p>
              <div className="flex items-center text-forensics-cyber-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Tamper-Proof Storage</span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="glass-card border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-400/40 transition-all duration-300"
            >
              <div className="p-4 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl w-fit mb-6">
                <Database className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Evidence Management</h3>
              <p className="text-forensics-slate-300 mb-6">
                Comprehensive digital evidence storage with automated metadata extraction, 
                file integrity monitoring, and secure chain of custody tracking.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Complete Audit Trail</span>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="glass-card border border-orange-500/20 rounded-2xl p-8 hover:border-orange-400/40 transition-all duration-300"
            >
              <div className="p-4 bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-xl w-fit mb-6">
                <Activity className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Analytics</h3>
              <p className="text-forensics-slate-300 mb-6">
                Advanced analytics dashboard with real-time case progress tracking, 
                team collaboration tools, and comprehensive reporting capabilities.
              </p>
              <div className="flex items-center text-orange-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Live Monitoring</span>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="glass-card border border-purple-500/20 rounded-2xl p-8 hover:border-purple-400/40 transition-all duration-300"
            >
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl w-fit mb-6">
                <Users className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
              <p className="text-forensics-slate-300 mb-6">
                Multi-user environment with role-based access controls, secure communication 
                channels, and collaborative investigation workflows.
              </p>
              <div className="flex items-center text-purple-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Secure Collaboration</span>
              </div>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="glass-card border border-blue-500/20 rounded-2xl p-8 hover:border-blue-400/40 transition-all duration-300"
            >
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl w-fit mb-6">
                <Search className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Search</h3>
              <p className="text-forensics-slate-300 mb-6">
                Powerful search capabilities across all evidence types with metadata indexing, 
                content analysis, and AI-powered pattern recognition.
              </p>
              <div className="flex items-center text-blue-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Smart Discovery</span>
              </div>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="glass-card border border-red-500/20 rounded-2xl p-8 hover:border-red-400/40 transition-all duration-300"
            >
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-xl w-fit mb-6">
                <FileText className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Automated Reporting</h3>
              <p className="text-forensics-slate-300 mb-6">
                Generate comprehensive forensic reports with automated evidence summaries, 
                timeline reconstruction, and court-ready documentation.
              </p>
              <div className="flex items-center text-red-400 font-semibold">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Court-Ready Reports</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-20 bg-gradient-to-r from-forensics-navy-900 via-forensics-slate-900 to-forensics-navy-900">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-forensics-slate-300 mb-8 max-w-2xl mx-auto">
                Join leading forensic investigators worldwide who trust our platform 
                for their most critical investigations.
              </p>
              <Link to="/auth">
                <motion.button
                  className="btn-cyber px-8 py-4 rounded-xl font-bold text-lg tracking-wide flex items-center space-x-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Your Investigation</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HomePage;