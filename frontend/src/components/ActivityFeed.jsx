import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { FileText, Shield, Clock, ExternalLink, Hash, User, Folder, Upload, Edit } from 'lucide-react';

const ActivityFeed = ({ items = [] }) => {
  const [visibleItems, setVisibleItems] = useState(10);

  const showMore = () => {
    setVisibleItems(prev => prev + 10);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">No Recent Activity</h3>
        <p className="text-slate-400 text-sm">Activity will appear here as cases and evidence are processed.</p>
      </div>
    );
  }

  const getActivityIcon = (type, action) => {
    switch (type) {
      case 'evidence':
        return action === 'uploaded' ? Upload : FileText;
      case 'case':
        return action === 'created' ? Folder : Edit;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'evidence':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'case':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  return (
    <div className="space-y-1">
      {items.slice(0, visibleItems).map((item, index) => {
        const Icon = getActivityIcon(item.type, item.action);
        const colorClasses = getActivityColor(item.type);
        
        return (
          <div
            key={`${item.type}-${item.id}-${index}`}
            className="group p-4 hover:bg-white/5 rounded-xl transition-all duration-200 border border-transparent hover:border-white/10"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg border ${colorClasses} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">
                      {item.type === 'evidence' ? 'Evidence' : 'Case'} {item.action || 'updated'}
                    </span>
                    {item.tx_hash && (
                      <div className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                        <Hash className="w-3 h-3 text-green-400" />
                        <span className="text-green-300 text-xs">Blockchain</span>
                      </div>
                    )}
                  </div>
                  <span className="text-slate-400 text-xs">
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {item.type === 'evidence' && (
                    <p className="text-blue-200 text-sm font-medium">
                      {item.filename}
                    </p>
                  )}
                  
                  {item.type === 'case' && (
                    <p className="text-purple-200 text-sm font-medium">
                      {item.title}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{item.by}</span>
                    </div>
                    
                    {item.case_id && (
                      <div className="flex items-center space-x-1">
                        <Folder className="w-3 h-3" />
                        <Link 
                          to={`/cases/${item.case_id}`}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Case #{item.case_id}
                        </Link>
                      </div>
                    )}
                    
                    {item.tx_hash && (
                      <div className="flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span 
                          className="font-mono text-green-400 cursor-pointer hover:text-green-300 transition-colors"
                          title={item.tx_hash}
                          onClick={() => navigator.clipboard.writeText(item.tx_hash)}
                        >
                          {item.tx_hash.slice(0, 8)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {items.length > visibleItems && (
        <div className="p-4 text-center border-t border-white/10">
          <button
            onClick={showMore}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Show {Math.min(10, items.length - visibleItems)} more activities
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
