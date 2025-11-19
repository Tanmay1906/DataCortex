import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Mail, 
  Phone, 
  Globe, 
  Award, 
  Users, 
  CheckCircle,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Cases', href: '/cases' },
    { name: 'Evidence', href: '/evidence' },
    { name: 'Documentation', href: '/docs' }
  ];
  
  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Compliance', href: '/compliance' }
  ];
  
  const securityFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'AES-256 military-grade security',
      color: 'text-forensics-cyber-400'
    },
    {
      icon: Shield,
      title: 'Blockchain Verification',
      description: 'Immutable chain of custody',
      color: 'text-green-400'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Ready',
      description: 'FIPS 140-2, ISO 27001 certified',
      color: 'text-blue-400'
    }
  ];
  
  return (
    <footer className="relative glass-effect border-t border-forensics-cyber-500/20 mt-auto">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>
      
      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-forensics-cyber-400 to-transparent" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-forensics-cyber-400 to-forensics-navy-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </motion.div>
              <div>
                <h3 className="text-xl font-black bg-gradient-to-r from-white to-forensics-cyber-300 bg-clip-text text-transparent">
                  DataCortex
                </h3>
                <p className="text-forensics-slate-400 text-sm font-medium">
                  Digital Investigation Platform
                </p>
              </div>
            </div>
            
            <p className="text-forensics-slate-300 text-sm leading-relaxed">
              Advanced digital forensics platform trusted by law enforcement and cybersecurity professionals worldwide.
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center space-x-2 px-3 py-1 glass-effect border border-forensics-cyber-500/30 rounded-full">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-medium text-forensics-slate-300">ISO Certified</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 glass-effect border border-green-500/30 rounded-full">
                <Users className="w-3 h-3 text-green-400" />
                <span className="text-xs font-medium text-forensics-slate-300">1000+ Users</span>
              </div>
            </div>
          </motion.div>
          
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-forensics-slate-300 hover:text-forensics-cyber-400 transition-colors duration-300 text-sm"
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white">Legal & Compliance</h4>
            <div className="space-y-3">
              {legalLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-forensics-slate-300 hover:text-forensics-cyber-400 transition-colors duration-300 text-sm"
                  whileHover={{ x: 4 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Contact & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h4 className="text-lg font-bold text-white">Contact</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-forensics-cyber-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">support@DataCortex.com</p>
                  <p className="text-forensics-slate-400 text-xs">Encrypted communications</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">+91-800-123-4567</p>
                  <p className="text-forensics-slate-400 text-xs">24/7 Support</p>
                </div>
              </div>
            </div>
            
            {/* Security Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-mono rounded border border-green-500/30">
                SSL/TLS
              </div>
              <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-mono rounded border border-blue-500/30">
                FIPS 140-2
              </div>
              <div className="px-2 py-1 bg-forensics-cyber-500/20 text-forensics-cyber-300 text-xs font-mono rounded border border-forensics-cyber-500/30">
                SOC 2
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-8 border-t border-forensics-slate-700/50"
        >
          <h4 className="text-lg font-bold text-white mb-6 text-center">Security & Compliance Excellence</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-3 p-4 glass-effect border border-forensics-cyber-500/20 rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Icon className={`w-5 h-5 ${feature.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <h5 className="font-semibold text-white text-sm">{feature.title}</h5>
                    <p className="text-forensics-slate-400 text-xs">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="border-t border-forensics-slate-700/50 pt-6"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2 text-forensics-slate-400 text-sm">
              <Lock className="w-4 h-4" />
              <span>&copy; {currentYear} ForensicsLab. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-400" />
                <span>for digital justice</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* System Status */}
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-xs text-green-400 font-medium">All Systems Operational</span>
              </div>
              
              {/* Global Coverage */}
              <div className="flex items-center space-x-2 px-3 py-1 glass-effect border border-forensics-cyber-500/30 rounded-full">
                <Globe className="w-3 h-3 text-forensics-cyber-400" />
                <span className="text-xs text-forensics-slate-300">Global Coverage</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
