import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Button = forwardRef(
  (
    {
      children,
      as = 'button',
      type = 'button',
      variant = 'primary',
      size = 'md',
      className = '',
      disabled = false,
      loading = false,
      icon,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
      relative inline-flex items-center justify-center font-semibold
      focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:cursor-not-allowed
      overflow-hidden group
      border border-transparent
      backdrop-blur-sm
      ${disabled ? 'pointer-events-none' : ''}
    `;

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm rounded-lg min-h-[36px] gap-2',
      md: 'px-6 py-3 text-sm rounded-xl min-h-[44px] gap-2.5',
      lg: 'px-8 py-4 text-base rounded-2xl min-h-[52px] gap-3',
      xl: 'px-10 py-5 text-lg rounded-2xl min-h-[60px] gap-3'
    };

    const variantClasses = {
      // Primary - Cyber Blue with Matrix effect
      primary: `
        bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600
        text-white shadow-lg shadow-cyan-500/25
        hover:shadow-xl hover:shadow-cyan-500/40
        focus:ring-cyan-400/50
        before:absolute before:inset-0 before:bg-gradient-to-r 
        before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-200%] hover:before:translate-x-[200%]
        before:transition-transform before:duration-700
        border-cyan-400/20
      `,
      
      // Secondary - Digital Green forensic theme
      secondary: `
        bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600
        text-white shadow-lg shadow-emerald-500/25
        hover:shadow-xl hover:shadow-emerald-500/40
        focus:ring-emerald-400/50
        before:absolute before:inset-0 before:bg-gradient-to-r
        before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-200%] hover:before:translate-x-[200%]
        before:transition-transform before:duration-700
        border-emerald-400/20
      `,
      
      // Outline - Sleek forensic scanner style
      outline: `
        bg-slate-900/30 border-2 border-cyan-400/50
        text-cyan-300 shadow-lg shadow-slate-900/25
        hover:bg-slate-800/50 hover:border-cyan-300
        hover:text-cyan-200 hover:shadow-xl hover:shadow-cyan-500/20
        focus:ring-cyan-400/50
        backdrop-blur-md
        before:absolute before:inset-0 before:border-2 before:border-transparent
        before:bg-gradient-to-r before:from-cyan-500/20 before:to-purple-500/20
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300 before:rounded-[inherit]
        before:-z-10
      `,
      
      // Danger - Alert Red with pulse effect
      danger: `
        bg-gradient-to-r from-red-600 via-red-600 to-orange-600
        text-white shadow-lg shadow-red-500/25
        hover:shadow-xl hover:shadow-red-500/40
        focus:ring-red-400/50
        before:absolute before:inset-0 before:bg-gradient-to-r
        before:from-transparent before:via-white/10 before:to-transparent
        before:translate-x-[-200%] hover:before:translate-x-[200%]
        before:transition-transform before:duration-700
        border-red-400/20
        animate-pulse hover:animate-none
      `,
      
      // Ghost - Subtle forensic style
      ghost: `
        bg-transparent text-slate-300
        hover:bg-slate-800/40 hover:text-white
        focus:ring-slate-400/50
        border-slate-600/30 hover:border-slate-500/50
        shadow-sm hover:shadow-lg hover:shadow-slate-900/25
        backdrop-blur-sm
      `,
      
      // Premium - Gold accent for premium features
      premium: `
        bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-500
        text-slate-900 shadow-lg shadow-amber-500/25
        hover:shadow-xl hover:shadow-amber-500/40
        focus:ring-amber-400/50
        font-bold
        before:absolute before:inset-0 before:bg-gradient-to-r
        before:from-transparent before:via-white/20 before:to-transparent
        before:translate-x-[-200%] hover:before:translate-x-[200%]
        before:transition-transform before:duration-700
        border-amber-400/30
      `
    };

    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

    // Loading spinner component
    const LoadingSpinner = () => (
      <motion.div
        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );

    // Matrix-style scanning line effect
    const ScanningLine = () => (
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          initial={{ y: 0, opacity: 0 }}
          whileHover={{
            y: ['0%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    );

    const buttonContent = (
      <>
        {/* Scanning line effect */}
        <ScanningLine />
        
        {/* Glow effect overlay */}
        <div className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-cyan-400/10 via-blue-400/10 to-purple-400/10 blur-sm" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-inherit">
          {loading && <LoadingSpinner />}
          {icon && !loading && (
            <motion.span
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.span>
          )}
          <span className="relative">
            {children}
            
            {/* Text glow effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur-sm">
              {children}
            </span>
          </span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-current opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-current opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-current opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-current opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
      </>
    );

    const motionProps = {
      whileHover: { 
        scale: 1.02,
        y: -1
      },
      whileTap: { 
        scale: 0.98,
        y: 0
      },
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    };

    if (as === 'link' && props.to) {
      return (
        <motion.div {...motionProps}>
          <Link ref={ref} className={classes} {...props}>
            {buttonContent}
          </Link>
        </motion.div>
      );
    }

    if (as === 'a') {
      return (
        <motion.div {...motionProps}>
          <a ref={ref} className={classes} {...props}>
            {buttonContent}
          </a>
        </motion.div>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled || loading}
        {...motionProps}
        {...props}
      >
        {buttonContent}
      </motion.button>
    );
  }
);

Button.displayName = 'ForensicButton';

export default Button;