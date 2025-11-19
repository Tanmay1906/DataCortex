import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-forensics-cyber-500 to-forensics-navy-500 hover:from-forensics-cyber-400 hover:to-forensics-navy-400 text-white shadow-lg hover:shadow-xl focus:ring-forensics-cyber-400',
    secondary: 'glass-effect border border-forensics-cyber-500/30 text-forensics-cyber-300 hover:border-forensics-cyber-400 hover:text-white focus:ring-forensics-cyber-400',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-lg hover:shadow-xl focus:ring-red-400',
    ghost: 'text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30 focus:ring-forensics-slate-400',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg hover:shadow-xl focus:ring-green-400',
    outline: 'border-2 border-forensics-cyber-500 text-forensics-cyber-400 hover:bg-forensics-cyber-500 hover:text-white focus:ring-forensics-cyber-400'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-2xl'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
