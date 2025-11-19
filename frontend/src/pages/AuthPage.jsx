import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Fingerprint } from 'lucide-react';
import { useState } from 'react';

const AuthPage = ({ type: initialType }) => {
  const [activeTab, setActiveTab] = useState(initialType || 'login');

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 w-full h-full opacity-20">
          <div className="absolute inset-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60"
        />
        <motion.div
          animate={{ 
            x: [0, -150, 0],
            y: [0, 120, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-40"
        />
        <motion.div
          animate={{ 
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 left-3/4 w-3 h-3 bg-indigo-300 rounded-full opacity-30"
        />
      </div>

      <div className="relative z-10 flex flex-col py-6 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-screen w-full">
        {/* Tab Navigation Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Investigator Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Join Team
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 0.8,
            ease: [0.4, 0, 0.2, 1],
            staggerChildren: 0.1
          }}
          className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center"
        >
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-4 sm:mb-6 lg:mb-8"
          >
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2 mb-4"
            >
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-12"></div>
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-12"></div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-slate-300 font-medium"
            >
              {activeTab === 'login' ? 
                'Secure Access Portal' : 
                'Join the Investigation Team'
              }
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              transition={{ delay: 0.7, duration: 1 }}
              className="mx-auto mt-2 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 w-24"
            ></motion.div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-2xl opacity-20 blur-lg"></div>
            
            {/* Form Background */}
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
              <div className="relative p-4 sm:p-6 lg:p-8">
                {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
              </div>
            </div>
          </motion.div>

          {/* Footer Security Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30">
              <Eye className="w-4 h-4 text-emerald-400 mr-2" />
              <span className="text-sm text-emerald-300 font-medium">
                256-bit SSL Encrypted
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;