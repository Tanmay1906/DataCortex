import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, AlertTriangle } from 'lucide-react';

const LoginForm = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formError, setFormError] = useState(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const onSubmit = async (data) => {
    setFormError(null);
    const success = await login(data.email, data.password);
    if (success) {
      navigate("/dashboard");
    } else {
      setFormError(error || "Invalid credentials");
    }
  };

  const inputVariants = {
    focused: { 
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    unfocused: { 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Investigator Access
        </h2>
        <p className="text-slate-300 text-sm">
          Enter your credentials to access the forensic dashboard
        </p>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <motion.div
          variants={inputVariants}
          animate={focusedField === 'email' ? 'focused' : 'unfocused'}
          className="relative"
        >
          <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative group">
            {/* Input Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur"></div>
            
            <div className="relative flex items-center">
              <div className="absolute left-4 z-10">
                <Mail className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'email' || watchedEmail ? 'text-cyan-400' : 'text-slate-400'
                }`} />
              </div>
              
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:bg-slate-800/70 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                placeholder="investigator@forensics.com"
              />
              
              {/* Success Indicator */}
              {watchedEmail && !errors.email && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute right-4"
                >
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                </motion.div>
              )}
            </div>
          </div>
          
          {errors.email && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-400 text-sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errors.email.message}
            </motion.div>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div
          variants={inputVariants}
          animate={focusedField === 'password' ? 'focused' : 'unfocused'}
          className="relative"
        >
          <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
            Password
          </label>
          <div className="relative group">
            {/* Input Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur"></div>
            
            <div className="relative flex items-center">
              <div className="absolute left-4 z-10">
                <Lock className={`w-5 h-5 transition-colors duration-200 ${
                  focusedField === 'password' || watchedPassword ? 'text-cyan-400' : 'text-slate-400'
                }`} />
              </div>
              
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:bg-slate-800/70 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your secure password"
              />
              
              {/* Password Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 z-10 p-1 text-slate-400 hover:text-cyan-400 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          {errors.password && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mt-2 text-red-400 text-sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {errors.password.message}
            </motion.div>
          )}
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-[1px] transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
            
            <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-white font-semibold text-lg transition-all duration-300 group-hover:from-cyan-400 group-hover:to-blue-500">
              {isSubmitting ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                  />
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center group">
                  <span>Access Forensic System</span>
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4 border-t border-slate-600/30"
        >
          <p className="text-xs text-slate-400 flex items-center justify-center">
            <Shield className="w-3 h-3 mr-1" />
            All sessions are monitored and encrypted
          </p>
        </motion.div>

        {/* Form Error Message */}
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-red-500 text-sm text-center"
          >
            {formError}
          </motion.div>
        )}
      </form>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          <div className="flex items-center">
            <span className="mr-2">
              {toast.type === 'error' ? '❌' : '✅'}
            </span>
            {toast.message}
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;