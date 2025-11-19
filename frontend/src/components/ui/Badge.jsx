import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  pulse = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full';
  
  const variants = {
    default: 'bg-forensics-slate-700 text-forensics-slate-300',
    primary: 'bg-forensics-cyber-500/20 text-forensics-cyber-300 border border-forensics-cyber-500/30',
    secondary: 'bg-forensics-navy-500/20 text-forensics-navy-300 border border-forensics-navy-500/30',
    success: 'bg-green-500/20 text-green-300 border border-green-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    outline: 'border border-forensics-cyber-500/40 text-forensics-cyber-400 bg-transparent'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  const pulseClasses = pulse ? 'animate-pulse' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${pulseClasses} ${className}`;
  
  return (
    <motion.span
      className={classes}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
