import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tabs = ({ children, defaultTab, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-forensics-slate-700/50">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {children.map((child) => {
            const { tabId, label, icon: Icon, badge } = child.props;
            const isActive = activeTab === tabId;
            
            return (
              <motion.button
                key={tabId}
                onClick={() => handleTabChange(tabId)}
                className={`relative flex items-center space-x-2 py-4 px-2 whitespace-nowrap font-semibold transition-all duration-300 ${
                  isActive
                    ? 'text-forensics-cyber-400 border-b-2 border-forensics-cyber-400'
                    : 'text-forensics-slate-400 hover:text-forensics-slate-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {Icon && <Icon className="w-5 h-5" />}
                <span>{label}</span>
                {badge && (
                  <span className="bg-forensics-cyber-500/20 text-forensics-cyber-300 px-2 py-1 rounded-full text-xs">
                    {badge}
                  </span>
                )}
                
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-forensics-cyber-400 rounded-full"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>
      
      <div className="min-h-96">
        <AnimatePresence mode="wait">
          {children.find(child => child.props.tabId === activeTab)}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TabPanel = ({ tabId, label, icon, badge, children, className = '' }) => {
  return (
    <motion.div
      key={tabId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export { Tabs, TabPanel };
export default Tabs;
