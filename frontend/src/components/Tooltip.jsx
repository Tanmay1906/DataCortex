import { useState } from 'react';

const Tooltip = ({ content, children, disabled = false, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (disabled) return children;

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-block"
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-slate-800 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-slate-800 rotate-45 ${position === 'top' ? '-bottom-1' : ''} ${position === 'bottom' ? '-top-1' : ''} ${position === 'left' ? '-right-1' : ''} ${position === 'right' ? '-left-1' : ''}`} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;