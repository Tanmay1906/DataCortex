import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaHistory, 
  FaUser, 
  FaClock, 
  FaEdit, 
  FaUpload, 
  FaTrash, 
  FaEye,
  FaShieldAlt,
  FaDownload,
  FaSearch,
  FaFilter,
  FaFileAlt,
  FaSpinner,
  FaMapMarkerAlt,
  FaDesktop
} from 'react-icons/fa';
import { formatDate, formatRelativeTime } from '../../../../utils/helpers';

const AuditTrail = ({ caseId }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, [caseId]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/evidence/audit/case/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuditLogs(data);
      } else {
        console.error('Failed to fetch audit logs');
        setAuditLogs([]);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    const icons = {
      evidence_upload: <FaUpload className="text-blue-400" />,
      case_created: <FaFileAlt className="text-green-400" />,
      case_updated: <FaEdit className="text-yellow-400" />,
      evidence_viewed: <FaEye className="text-purple-400" />,
      evidence_deleted: <FaTrash className="text-red-400" />,
      access_granted: <FaShieldAlt className="text-emerald-400" />,
      default: <FaHistory className="text-slate-400" />
    };
    return icons[action] || icons.default;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Lead Detective': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Forensic Analyst': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Investigator': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Supervisor': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Financial Analyst': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesUser = filterUser === 'all' || log.userId === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueUsers = [...new Set(auditLogs.map(log => log.userId))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-blue-400 mr-3" />
        <span className="text-slate-300">Loading audit trail...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Audit Trail</h3>
          <p className="text-slate-400">
            Complete log of all activities and changes made to this case
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map(action => (
              <option key={action} value={action}>
                {action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
          
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Users</option>
            {uniqueUsers.map(user => (
              <option key={user} value={user}>{user}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <FaHistory className="mx-auto text-4xl text-slate-500 mb-4" />
          <h4 className="text-lg font-medium text-slate-300 mb-2">No Activities Found</h4>
          <p className="text-slate-500">
            {searchTerm || filterAction !== 'all' || filterUser !== 'all'
              ? 'No activities match your search criteria'
              : 'No activities have been logged for this case yet'
            }
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30"></div>
          
          <div className="space-y-6">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start space-x-4"
              >
                {/* Timeline Icon */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-slate-800 border-2 border-slate-700 rounded-full">
                  {getActionIcon(log.action)}
                </div>
                
                {/* Activity Card */}
                <div className="flex-1 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h4 className="font-semibold text-white">{log.description}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(log.userRole)}`}>
                          {log.userRole}
                        </span>
                      </div>
                      
                      {/* User and Time Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                        <div className="flex items-center space-x-2">
                          <FaUser />
                          <span>{log.userId}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaClock />
                          <span>{formatDate(log.timestamp)}</span>
                          <span className="text-xs">({formatRelativeTime(log.timestamp)})</span>
                        </div>
                      </div>

                      {/* Technical Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center space-x-2 text-sm">
                          <FaMapMarkerAlt className="text-slate-500" />
                          <span className="text-slate-400">IP:</span>
                          <span className="font-mono text-slate-300">{log.ipAddress}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FaDesktop className="text-slate-500" />
                          <span className="text-slate-400">Client:</span>
                          <span className="text-slate-300 truncate" title={log.userAgent}>
                            {log.userAgent.split(' ')[0]} Browser
                          </span>
                        </div>
                      </div>

                      {/* Additional Details */}
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
                          <h5 className="text-sm font-medium text-slate-300 mb-2">Additional Details</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {Object.entries(log.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-slate-400 capitalize">{key.replace('_', ' ')}:</span>
                                <span className="text-slate-300 font-mono">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex justify-center pt-6">
        <button className="inline-flex items-center px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg text-white transition-colors duration-200">
          <FaDownload className="mr-2" />
          Export Audit Log
        </button>
      </div>
    </div>
  );
};

export default AuditTrail;
