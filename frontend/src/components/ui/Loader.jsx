import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

const Loader = ({ size = 'md', variant = 'default', message = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const variants = {
    default: 'bg-forensics-cyber-500',
    primary: 'bg-gradient-to-r from-forensics-cyber-500 to-forensics-navy-500',
    forensics: 'bg-gradient-to-r from-forensics-cyber-400 to-blue-500'
  };

  if (variant === 'forensics') {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        {/* Forensics Scanner Animation */}
        <div className="relative">
          <motion.div
            className={`${sizes[size]} glass-effect border border-forensics-cyber-500/50 rounded-xl flex items-center justify-center`}
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(8, 145, 178, 0.3)',
                '0 0 40px rgba(8, 145, 178, 0.6)',
                '0 0 20px rgba(8, 145, 178, 0.3)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Shield className="w-6 h-6 text-forensics-cyber-400" />
          </motion.div>
          
          {/* Scanning Lines */}
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-forensics-cyber-400 to-transparent"
              animate={{ y: [0, 64] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
          
          {/* Pulse Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 border border-forensics-cyber-400/30 rounded-xl"
              animate={{
                scale: [1, 2, 1],
                opacity: [0.7, 0, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
        
        {/* Loading Text */}
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <p className="text-forensics-slate-300 font-semibold">{message}</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-forensics-cyber-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <motion.div
        className={`${sizes[size]} ${variants[variant]} rounded-full flex items-center justify-center`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Zap className="w-1/2 h-1/2 text-white" />
      </motion.div>
      
      {message && (
        <motion.p
          className="text-forensics-slate-300 font-medium text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default Loader;