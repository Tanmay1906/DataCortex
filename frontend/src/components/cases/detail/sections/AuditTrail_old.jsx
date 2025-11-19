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
  FaSpinner
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
  {
    id: 1,
    action: 'CASE_CREATED',
    description: 'Case created with initial details',
    userId: 'detective.smith@trm.gov',
    userRole: 'Lead Detective',
    timestamp: '2025-01-15T09:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      caseTitle: 'Digital Fraud Investigation',
      initialStatus: 'open'
    }
  },
  {
    id: 2,
    action: 'EVIDENCE_UPLOADED',
    description: 'Evidence file uploaded: suspicious_email.eml',
    userId: 'forensic.analyst@trm.gov',
    userRole: 'Forensic Analyst',
    timestamp: '2025-01-16T14:30:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      filename: 'suspicious_email.eml',
      fileSize: 15420,
      sha256Hash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456'
    }
  },
  {
    id: 3,
    action: 'CASE_UPDATED',
    description: 'Case status changed from open to under_investigation',
    userId: 'detective.smith@trm.gov',
    userRole: 'Lead Detective',
    timestamp: '2025-01-17T11:15:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      oldStatus: 'open',
      newStatus: 'under_investigation',
      reason: 'Initial evidence review completed'
    }
  },
  {
    id: 4,
    action: 'EVIDENCE_ACCESSED',
    description: 'Evidence file downloaded: hard_drive_image.dd',
    userId: 'cybersec.expert@trm.gov',
    userRole: 'Cybersecurity Expert',
    timestamp: '2025-01-18T16:45:00Z',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      filename: 'hard_drive_image.dd',
      accessType: 'download',
      purpose: 'Deep forensic analysis'
    }
  },
  {
    id: 5,
    action: 'BLOCKCHAIN_VERIFICATION',
    description: 'Evidence integrity verified on blockchain',
    userId: 'system.blockchain@trm.gov',
    userRole: 'System',
    timestamp: '2025-01-19T08:20:00Z',
    ipAddress: 'system',
    userAgent: 'TRM-Blockchain-Service/1.0',
    details: {
      txHash: '0x1234567890abcdef1234567890abcdef12345678',
      blockNumber: 18945672,
      verificationStatus: 'success'
    }
  },
  {
    id: 6,
    action: 'CASE_VIEWED',
    description: 'Case details accessed and reviewed',
    userId: 'supervisor.jones@trm.gov',
    userRole: 'Case Supervisor',
    timestamp: '2025-01-20T13:10:00Z',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    details: {
      viewDuration: '15 minutes',
      sectionsViewed: ['overview', 'evidence', 'blockchain']
    }
  }
];

const AuditTrail = ({ caseId, caseData }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await getAuditLogsByCase(caseId);
        // setAuditLogs(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setAuditLogs(mockAuditLogs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, [caseId]);

  const getActionIcon = (action) => {
    const icons = {
      CASE_CREATED: FaFileAlt,
      CASE_UPDATED: FaEdit,
      CASE_VIEWED: FaEye,
      EVIDENCE_UPLOADED: FaUpload,
      EVIDENCE_ACCESSED: FaDownload,
      EVIDENCE_DELETED: FaTrash,
      BLOCKCHAIN_VERIFICATION: FaShieldAlt,
      USER_LOGIN: FaUser,
      USER_LOGOUT: FaUser
    };
    
    const IconComponent = icons[action] || FaHistory;
    return <IconComponent />;
  };

  const getActionColor = (action) => {
    const colors = {
      CASE_CREATED: 'text-blue-400',
      CASE_UPDATED: 'text-yellow-400',
      CASE_VIEWED: 'text-green-400',
      EVIDENCE_UPLOADED: 'text-cyan-400',
      EVIDENCE_ACCESSED: 'text-purple-400',
      EVIDENCE_DELETED: 'text-red-400',
      BLOCKCHAIN_VERIFICATION: 'text-emerald-400',
      USER_LOGIN: 'text-slate-400',
      USER_LOGOUT: 'text-slate-400'
    };
    
    return colors[action] || 'text-slate-400';
  };

  const getRoleBadge = (role) => {
    const badges = {
      'Lead Detective': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Forensic Analyst': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Cybersecurity Expert': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Case Supervisor': 'bg-green-500/20 text-green-400 border-green-500/30',
      'System': 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    };
    
    const badgeClass = badges[role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    return (
      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${badgeClass}`}>
        {role}
      </span>
    );
  };

  const exportAuditLog = () => {
    // TODO: Implement audit log export functionality
    console.log('Export audit log for case:', caseId);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesUser = filterUser === 'all' || log.userId === filterUser;
    
    // Date range filtering
    let matchesDate = true;
    if (dateRange !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      const daysDiff = Math.floor((now - logDate) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case '1day':
          matchesDate = daysDiff <= 1;
          break;
        case '7days':
          matchesDate = daysDiff <= 7;
          break;
        case '30days':
          matchesDate = daysDiff <= 30;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesAction && matchesUser && matchesDate;
  });

  const uniqueUsers = [...new Set(auditLogs.map(log => log.userId))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-slate-400">Loading audit trail...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Audit Trail Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaHistory className="text-purple-400 text-xl mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">Audit Trail</h2>
              <p className="text-slate-400 text-sm">
                {auditLogs.length} total activities • Full compliance logging
              </p>
            </div>
          </div>
          
          <button
            onClick={exportAuditLog}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <FaDownload className="mr-2" />
            Export Log
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
          </div>

          {/* Action Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            >
              <option value="all">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>
                  {user.split('@')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="relative">
            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            >
              <option value="all">All Time</option>
              <option value="1day">Last 24 Hours</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Audit Log Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <FaHistory className="text-slate-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Activities Found</h3>
            <p className="text-slate-400">
              {searchTerm || filterAction !== 'all' || filterUser !== 'all' || dateRange !== 'all'
                ? 'No activities match your search criteria.'
                : 'No audit activities recorded for this case.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline connector */}
                {index < filteredLogs.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gradient-to-b from-slate-600 to-transparent"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Action Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center ${getActionColor(log.action)}`}>
                    {getActionIcon(log.action)}
                  </div>
                  
                  {/* Activity Details */}
                  <div className="flex-1 bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-medium mb-1">{log.description}</h3>
                        <div className="flex items-center space-x-3 text-sm">
                          <span className="text-slate-400">{log.userId.split('@')[0]}</span>
                          {getRoleBadge(log.userRole)}
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">{formatRelativeTime(log.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right text-xs text-slate-500">
                        <div>{formatDate(log.timestamp)}</div>
                        <div className="font-mono">{log.ipAddress}</div>
                      </div>
                    </div>
                    
                    {/* Activity Details */}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="bg-slate-900/50 rounded-lg p-3 mt-3">
                        <div className="text-xs text-slate-400 mb-2">Activity Details:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-slate-500 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span className="text-slate-300 font-mono truncate ml-2">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* User Agent (for non-system actions) */}
                    {log.userRole !== 'System' && (
                      <div className="mt-2 text-xs text-slate-500 truncate">
                        User Agent: {log.userAgent}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Audit Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Audit Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {auditLogs.filter(log => log.action.includes('CASE')).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Case Activities</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {auditLogs.filter(log => log.action.includes('EVIDENCE')).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Evidence Activities</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {auditLogs.filter(log => log.action.includes('BLOCKCHAIN')).length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Blockchain Verifications</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {uniqueUsers.length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Unique Users</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuditTrail;
