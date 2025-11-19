import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label,
  error,
  helperText,
  icon: Icon,
  rightIcon: RightIcon,
  className = '',
  type = 'text',
  variant = 'default',
  size = 'md',
  ...props 
}, ref) => {
  const baseClasses = 'w-full transition-all duration-300 focus:outline-none placeholder-forensics-slate-400 text-white';
  
  const variants = {
    default: 'glass-effect border border-forensics-cyber-500/30 focus:border-forensics-cyber-400 focus:ring-2 focus:ring-forensics-cyber-400/20',
    filled: 'bg-forensics-slate-800 border border-forensics-slate-700 focus:border-forensics-cyber-400 focus:ring-2 focus:ring-forensics-cyber-400/20',
    outline: 'bg-transparent border-2 border-forensics-cyber-500/40 focus:border-forensics-cyber-400'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-sm rounded-xl',
    lg: 'px-6 py-4 text-base rounded-xl'
  };
  
  const errorClasses = error ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20' : '';
  const iconPadding = Icon ? (size === 'sm' ? 'pl-10' : size === 'lg' ? 'pl-14' : 'pl-12') : '';
  const rightIconPadding = RightIcon ? (size === 'sm' ? 'pr-10' : size === 'lg' ? 'pr-14' : 'pr-12') : '';
  
  const inputClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${errorClasses} ${iconPadding} ${rightIconPadding} ${className}`;
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-forensics-slate-300">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-forensics-slate-400 ${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          }`} />
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {RightIcon && (
          <RightIcon className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-forensics-slate-400 ${
            size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'
          }`} />
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-forensics-slate-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
