import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description,
  className = '',
  variant = 'default',
  loading = false
}) => {
  const variants = {
    default: 'glass-card border border-forensics-cyber-500/20',
    success: 'glass-card border border-green-500/30',
    warning: 'glass-card border border-yellow-500/30',
    danger: 'glass-card border border-red-500/30'
  };

  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-forensics-slate-400'
  };

  const TrendIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : Minus;

  if (loading) {
    return (
      <div className={`${variants[variant]} rounded-2xl p-6 animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-16 h-4 bg-forensics-slate-700 rounded"></div>
            <div className="w-8 h-8 bg-forensics-slate-700 rounded-lg"></div>
          </div>
          <div className="w-20 h-8 bg-forensics-slate-700 rounded"></div>
          <div className="w-24 h-3 bg-forensics-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${variants[variant]} rounded-2xl p-6 hover:border-forensics-cyber-400/40 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.02, y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-forensics-slate-400 uppercase tracking-wide">
            {title}
          </h3>
          {Icon && (
            <div className="p-2 bg-forensics-cyber-500/20 rounded-lg">
              <Icon className="w-5 h-5 text-forensics-cyber-400" />
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="space-y-2">
          <p className="text-3xl font-black text-white">
            {value}
          </p>
          
          {/* Change and Description */}
          <div className="flex items-center justify-between">
            {change && (
              <div className="flex items-center space-x-1">
                <TrendIcon className={`w-4 h-4 ${changeColors[changeType]}`} />
                <span className={`text-sm font-semibold ${changeColors[changeType]}`}>
                  {change}
                </span>
              </div>
            )}
            
            {description && (
              <p className="text-xs text-forensics-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsGrid = ({ children, columns = 4, className = '' }) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 ${className}`}>
      {children}
    </div>
  );
};

export { StatCard, StatsGrid };
export default StatCard;
