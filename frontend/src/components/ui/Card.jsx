import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Card = forwardRef(({ 
  children, 
  className = '', 
  variant = 'default',
  hoverable = false,
  ...props 
}, ref) => {
  const baseClasses = 'overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'glass-card border border-forensics-cyber-500/20 rounded-2xl',
    elevated: 'glass-card border border-forensics-cyber-500/30 rounded-2xl shadow-2xl',
    outline: 'border-2 border-forensics-cyber-500/40 rounded-2xl bg-transparent',
    solid: 'bg-forensics-slate-800 border border-forensics-slate-700 rounded-2xl',
    danger: 'glass-card border border-red-500/30 rounded-2xl',
    success: 'glass-card border border-green-500/30 rounded-2xl',
    warning: 'glass-card border border-yellow-500/30 rounded-2xl'
  };
  
  const hoverClasses = hoverable ? 'hover:border-forensics-cyber-400/50 hover:shadow-lg cursor-pointer' : '';
  
  const classes = `${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`;
  
  if (hoverable) {
    return (
      <motion.div
        ref={ref}
        className={classes}
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-b border-forensics-slate-700/50 ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-forensics-slate-700/50 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-bold text-white ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-forensics-slate-300 ${className}`} {...props}>
    {children}
  </p>
);

export { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription };
export default Card;
