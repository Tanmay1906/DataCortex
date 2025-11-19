import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useEffect } from 'react';

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible = true, 
  onClose, 
  autoClose = false, 
  autoCloseDelay = 5000,
  className = '',
  actionButton
}) => {
  const variants = {
    success: {
      bg: 'border-green-500/30 bg-green-500/10',
      icon: CheckCircle,
      iconColor: 'text-green-400',
      titleColor: 'text-green-300',
      messageColor: 'text-green-200'
    },
    error: {
      bg: 'border-red-500/30 bg-red-500/10',
      icon: AlertCircle,
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      messageColor: 'text-red-200'
    },
    warning: {
      bg: 'border-yellow-500/30 bg-yellow-500/10',
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-300',
      messageColor: 'text-yellow-200'
    },
    info: {
      bg: 'border-forensics-cyber-500/30 bg-forensics-cyber-500/10',
      icon: Info,
      iconColor: 'text-forensics-cyber-400',
      titleColor: 'text-forensics-cyber-300',
      messageColor: 'text-forensics-cyber-200'
    }
  };

  const variant = variants[type];
  const Icon = variant.icon;

  useEffect(() => {
    if (autoClose && isVisible && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`glass-card border ${variant.bg} rounded-xl p-4 ${className}`}
        >
          <div className="flex items-start space-x-3">
            <Icon className={`w-5 h-5 ${variant.iconColor} flex-shrink-0 mt-0.5`} />
            
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`font-semibold ${variant.titleColor} mb-1`}>
                  {title}
                </h4>
              )}
              
              {message && (
                <p className={`text-sm ${variant.messageColor}`}>
                  {message}
                </p>
              )}
              
              {actionButton && (
                <div className="mt-3">
                  {actionButton}
                </div>
              )}
            </div>
            
            {onClose && (
              <motion.button
                onClick={onClose}
                className={`${variant.iconColor} hover:opacity-70 transition-opacity duration-200 flex-shrink-0`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          
          {autoClose && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 ${variant.iconColor.replace('text-', 'bg-')} rounded-b-xl`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
