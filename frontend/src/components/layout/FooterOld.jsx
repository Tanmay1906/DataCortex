import React from 'react';
import { Shield, Lock, Mail, Phone, Globe, Award, Users, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 text-white overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="grid grid-cols-12 gap-4 h-full opacity-20">
            {Array.from({length: 24}).map((_, i) => (
              <div 
                key={i} 
                className="bg-blue-400 rounded-sm animate-pulse" 
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Glowing border effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  CyberForensics Pro
                </h3>
                <p className="text-blue-200 text-xs font-medium">Advanced Investigation Suite</p>
              </div>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              Empowering law enforcement with cutting-edge digital forensics technology. 
              Trusted by agencies worldwide.
            </p>
            
            {/* Trust indicators */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700">
                <Award className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-medium text-slate-300">ISO Certified</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800/50 rounded-md border border-slate-700">
                <Users className="w-3 h-3 text-green-400" />
                <span className="text-xs font-medium text-slate-300">500+ Agencies</span>
              </div>
            </div>
          </div>
          
          {/* Security Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-l-4 border-cyan-400 pl-3">
              Security Excellence
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-cyan-300">Military-Grade Encryption</p>
                  <p className="text-xs text-slate-400">AES-256 end-to-end security</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-purple-300">Blockchain Chain of Custody</p>
                  <p className="text-xs text-slate-400">Immutable evidence tracking</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-green-300">AI-Powered Analysis</p>
                  <p className="text-xs text-slate-400">Advanced pattern recognition</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-l-4 border-purple-400 pl-3">
              Secure Contact
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <Mail className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">forensics@cyberforensics.pro</p>
                  <p className="text-xs text-slate-400">Encrypted communications</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <Phone className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-white">+1-800-FORENSIC</p>
                  <p className="text-xs text-slate-400">24/7 Emergency Line</p>
                </div>
              </div>
            </div>
            
            {/* Security badges */}
            <div className="flex items-center space-x-2 mt-3">
              <div className="px-2 py-1 bg-green-900/50 text-green-300 text-xs font-mono rounded border border-green-700">
                SSL/TLS
              </div>
              <div className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs font-mono rounded border border-blue-700">
                FIPS 140-2
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-slate-700/50 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <Lock className="w-4 h-4" />
              <span>&copy; {new Date().getFullYear()} CyberForensics Pro. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-green-300 font-medium">System Operational</span>
              </div>
              
              <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800 rounded-full border border-slate-600">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span className="text-xs text-slate-300">Global Coverage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;