import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building, 
  Phone, 
  AlertTriangle, 
  CheckCircle,
  Shield,
  UserPlus,
  Zap,
  ChevronDown
} from 'lucide-react';

const RegisterForm = () => {
  const { register, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [toast, setToast] = useState(null);

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchedFields = watch();

  const onSubmit = async (data) => {
    try {
      await register(data);
      setToast({
        type: 'success',
        message: 'Registration successful! Welcome to the team!',
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: error.message || 'Registration failed',
      });
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

  const fieldConfigs = [
    { 
      name: 'email', 
      label: 'Email Address', 
      type: 'email', 
      icon: Mail, 
      placeholder: 'investigator@forensics.com',
      required: true,
      validation: { required: 'Email is required' }
    },
    { 
      name: 'password', 
      label: 'Password', 
      type: 'password', 
      icon: Lock, 
      placeholder: 'Create a secure password (8+ chars)',
      required: true,
      hasToggle: true,
      validation: {
        required: 'Password is required',
        minLength: {
          value: 8,
          message: 'Password must be at least 8 characters',
        },
      }
    },
    { 
      name: 'name', 
      label: 'Full Name', 
      type: 'text', 
      icon: User, 
      placeholder: 'Dr. Rajesh Kumar',
      required: false,
      validation: {}
    },
    { 
      name: 'department', 
      label: 'Department', 
      type: 'select', 
      icon: Building, 
      placeholder: 'Select your cyber crime role',
      required: false,
      validation: {},
      options: [
        'Cyber Crime Investigation Unit',
        'Digital Forensics Specialist',
        'Cyber Security Analyst',
        'Online Financial Fraud Investigator',
        'Cyber Crime Technical Expert'
      ]
    },
    { 
      name: 'phone', 
      label: 'Phone Number', 
      type: 'tel', 
      icon: Phone, 
      placeholder: '+91 98765 43210',
      required: false,
      validation: {
        pattern: {
          value: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
          message: 'Please enter a valid Indian phone number'
        }
      }
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2,
            duration: 0.8,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 mb-4 relative"
        >
          <UserPlus className="w-8 h-8 text-white" />
          <motion.div
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-3 h-3 text-white" />
          </motion.div>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Join Our Team
        </h2>
        <p className="text-slate-300 text-sm">
          Create your investigator account to access the forensic system
        </p>
      </motion.div>

      {/* Error Display */}
      {(toast && toast.type === 'error') || error && (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
        >
          <div className="flex items-center text-red-300">
            <AlertTriangle className="w-5 h-5 mr-3" />
            <span className="text-sm">{toast?.message || error}</span>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fieldConfigs.map((field, index) => {
          const Icon = field.icon;
          const isActive = focusedField === field.name || watchedFields[field.name];
          const hasError = errors[field.name];
          const isValid = watchedFields[field.name] && !hasError;

          return (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                ...(focusedField === field.name ? inputVariants.focused : inputVariants.unfocused)
              }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <label 
                htmlFor={field.name} 
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                {field.label}
                {field.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              
              <div className="relative group">
                {/* Input Glow Effect */}
                <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-300 blur ${
                  isValid 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                    : hasError
                      ? 'bg-gradient-to-r from-red-500 to-pink-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}></div>
                
                <div className="relative flex items-center">
                  {/* Icon */}
                  <div className="absolute left-4 z-10">
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${
                      isValid
                        ? 'text-emerald-400'
                        : hasError
                          ? 'text-red-400'
                          : isActive 
                            ? 'text-cyan-400' 
                            : 'text-slate-400'
                    }`} />
                  </div>
                  
                  {/* Input or Select */}
                  {field.type === 'select' ? (
                    <div className="relative">
                      <select
                        id={field.name}
                        {...formRegister(field.name, field.validation)}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border rounded-xl text-white focus:bg-slate-800/70 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm appearance-none ${
                          isValid
                            ? 'border-emerald-400/50 focus:border-emerald-400/70 focus:ring-emerald-400/20'
                            : hasError
                              ? 'border-red-400/50 focus:border-red-400/70 focus:ring-red-400/20'
                              : 'border-slate-600/50 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                        }`}
                      >
                        <option value="" className="bg-slate-800 text-slate-400">
                          {field.placeholder}
                        </option>
                        {field.options?.map((option) => (
                          <option key={option} value={option} className="bg-slate-800 text-white">
                            {option}
                          </option>
                        ))}
                      </select>
                      
                      {/* Dropdown Arrow */}
                      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-5 h-5 transition-colors duration-200 ${
                          isValid
                            ? 'text-emerald-400'
                            : hasError
                              ? 'text-red-400'
                              : isActive 
                                ? 'text-cyan-400' 
                                : 'text-slate-400'
                        }`} />
                      </div>
                    </div>
                  ) : (
                    <input
                      id={field.name}
                      type={field.name === 'password' && showPassword ? 'text' : field.type}
                      {...formRegister(field.name, field.validation)}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-12 ${field.hasToggle ? 'pr-12' : 'pr-12'} py-4 bg-slate-800/50 border rounded-xl text-white placeholder-slate-400 focus:bg-slate-800/70 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                        isValid
                          ? 'border-emerald-400/50 focus:border-emerald-400/70 focus:ring-emerald-400/20'
                          : hasError
                            ? 'border-red-400/50 focus:border-red-400/70 focus:ring-red-400/20'
                            : 'border-slate-600/50 focus:border-cyan-400/50 focus:ring-cyan-400/20'
                      }`}
                      placeholder={field.placeholder}
                    />
                  )}
                  
                  {/* Right side icons */}
                  <div className="absolute right-4 z-10 flex items-center space-x-2">
                    {/* Password Toggle */}
                    {field.hasToggle && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-slate-400 hover:text-cyan-400 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    )}
                    
                    {/* Status Indicator */}
                    {isValid && field.type !== 'select' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    )}
                    
                    {/* Status Indicator for Select */}
                    {isValid && field.type === 'select' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-16"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Error Message */}
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center mt-2 text-red-400 text-sm"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {hasError.message}
                </motion.div>
              )}

              {/* Password Strength Indicator */}
              {field.name === 'password' && watchedFields.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2"
                >
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-sm transition-colors duration-300 ${
                          watchedFields.password.length >= level * 2
                            ? watchedFields.password.length >= 8
                              ? 'bg-emerald-400'
                              : watchedFields.password.length >= 6
                                ? 'bg-yellow-400'
                                : 'bg-red-400'
                            : 'bg-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Password strength: {watchedFields.password.length >= 8 ? 'Strong' : watchedFields.password.length >= 6 ? 'Medium' : 'Weak'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-6"
        >
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 p-[1px] transition-all duration-300 hover:from-emerald-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
            
            <div className="relative flex items-center justify-center px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-xl text-white font-semibold text-lg transition-all duration-300 group-hover:from-emerald-400 group-hover:to-cyan-500">
              {isSubmitting ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                  />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-3" />
                  <span>Join Forensic Team</span>
                </div>
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-4 border-t border-slate-600/30"
        >
          <div className="flex items-center justify-center text-xs text-slate-400 mb-2">
            <Shield className="w-3 h-3 mr-1" />
            Your data is encrypted and secure
          </div>
          <p className="text-xs text-slate-500">
            By registering, you agree to our security protocols and investigation guidelines
          </p>
        </motion.div>
      </form>

      {/* Success Toast */}
      {toast && toast.type === 'success' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="fixed bottom-6 right-6 p-4 bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/30 rounded-xl shadow-xl z-50"
        >
          <div className="flex items-center text-white">
            <CheckCircle className="w-5 h-5 mr-3 text-emerald-200" />
            <span className="font-medium">{toast.message}</span>
            <button 
              onClick={() => setToast(null)}
              className="ml-4 text-emerald-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RegisterForm;