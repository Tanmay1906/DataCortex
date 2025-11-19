import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, trend, change }) => {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    steady: 'text-yellow-500',
  };

  const trendIcons = {
    up: (
      <svg
        className={`h-5 w-5 ${trendColors[trend]}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
          clipRule="evenodd"
        />
      </svg>
    ),
    down: (
      <svg
        className={`h-5 w-5 ${trendColors[trend]}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
          clipRule="evenodd"
        />
      </svg>
    ),
    steady: (
      <svg
        className={`h-5 w-5 ${trendColors[trend]}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-lg shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-100 text-gray-600">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {trendIcons[trend]}
        <p className={`ml-2 text-sm font-medium ${trendColors[trend]}`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
};

export default StatsCard;