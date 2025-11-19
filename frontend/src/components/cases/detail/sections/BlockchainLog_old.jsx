import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLink, 
  FaClock, 
  FaExternalLinkAlt, 
  FaShieldAlt, 
  FaFingerprint,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';
import { formatDate, formatRelativeTime } from '../../../../utils/helpers';

const BlockchainLog = ({ caseId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBlockchainLogs();
  }, [caseId]);

  const fetchBlockchainLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/evidence/blockchain/case/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      } else {
        console.error('Failed to fetch blockchain logs');
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching blockchain logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };
  {
    id: 1,
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    blockNumber: 18945672,
    timestamp: '2025-01-20T10:30:00Z',
    fileHash: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    filename: 'suspicious_email.eml',
    action: 'UPLOAD',
    gasUsed: 45892,
    status: 'confirmed',
    confirmations: 127,
    network: 'Ethereum Sepolia'
  },
  {
    id: 2,
    txHash: '0x5678901234abcdef5678901234abcdef56789012',
    blockNumber: 18945671,
    timestamp: '2025-01-19T15:45:00Z',
    fileHash: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
    filename: 'hard_drive_image.dd',
    action: 'VERIFY',
    gasUsed: 32156,
    status: 'confirmed',
    confirmations: 156,
    network: 'Ethereum Sepolia'
  },
  {
    id: 3,
    txHash: '0x9012345678abcdef9012345678abcdef90123456',
    blockNumber: 18945670,
    timestamp: '2025-01-18T09:15:00Z',
    fileHash: 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890',
    filename: 'network_traffic.pcap',
    action: 'UPDATE',
    gasUsed: 28734,
    status: 'pending',
    confirmations: 3,
    network: 'Ethereum Sepolia'
  }
];

const BlockchainLog = ({ caseId, caseData }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchBlockchainLogs = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await getBlockchainLogsByCase(caseId);
        // setLogs(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setLogs(mockBlockchainLogs);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching blockchain logs:', error);
        setLoading(false);
      }
    };

    fetchBlockchainLogs();
  }, [caseId]);

  const getActionBadge = (action) => {
    const badges = {
      UPLOAD: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '📤' },
      VERIFY: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅' },
      UPDATE: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '📝' },
      DELETE: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🗑️' }
    };
    
    const badge = badges[action] || badges.UPLOAD;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {action}
      </span>
    );
  };

  const getStatusIcon = (status, confirmations = 0) => {
    if (status === 'confirmed' && confirmations >= 12) {
      return <FaCheckCircle className="text-green-400" />;
    } else if (status === 'confirmed' && confirmations < 12) {
      return <FaSpinner className="text-yellow-400 animate-spin" />;
    } else if (status === 'pending') {
      return <FaSpinner className="text-blue-400 animate-spin" />;
    } else {
      return <FaExclamationTriangle className="text-red-400" />;
    }
  };

  const openInExplorer = (txHash, network) => {
    const explorers = {
      'Ethereum Sepolia': `https://sepolia.etherscan.io/tx/${txHash}`,
      'Ethereum Mainnet': `https://etherscan.io/tx/${txHash}`,
      'Ganache Local': `http://localhost:7545/tx/${txHash}` // Adjust port as needed
    };
    
    const url = explorers[network] || explorers['Ethereum Sepolia'];
    window.open(url, '_blank');
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.fileHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    return matchesSearch && matchesAction && matchesStatus;
  });

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          <span className="ml-3 text-slate-400">Loading blockchain logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blockchain Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaLink className="text-cyan-400 text-xl mr-3" />
            <div>
              <h2 className="text-xl font-bold text-white">Blockchain Transaction Log</h2>
              <p className="text-slate-400 text-sm">
                {logs.length} transactions • Evidence integrity verification
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">Network</div>
              <div className="text-white font-medium">Ethereum Sepolia</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">Gas Used (Total)</div>
              <div className="text-white font-medium">
                {logs.reduce((sum, log) => sum + log.gasUsed, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by transaction hash, file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            />
          </div>

          {/* Action Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            >
              <option value="all">All Actions</option>
              <option value="UPLOAD">Upload</option>
              <option value="VERIFY">Verify</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Blockchain Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        {filteredLogs.length === 0 ? (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FaLink className="text-slate-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No Blockchain Transactions</h3>
            <p className="text-slate-400">
              {searchTerm || filterAction !== 'all' || filterStatus !== 'all'
                ? 'No transactions match your search criteria.'
                : 'No blockchain transactions found for this case.'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="mr-4">
                    {getStatusIcon(log.status, log.confirmations)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      {getActionBadge(log.action)}
                      <span className="text-slate-400 text-sm">Block #{log.blockNumber.toLocaleString()}</span>
                    </div>
                    <h3 className="text-white font-medium">{log.filename}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                      <span className="flex items-center">
                        <FaClock className="mr-1" />
                        {formatRelativeTime(log.timestamp)}
                      </span>
                      <span>{log.confirmations} confirmations</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => openInExplorer(log.txHash, log.network)}
                  className="flex items-center px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-lg text-sm transition-colors"
                >
                  <FaExternalLinkAlt className="mr-1" />
                  View on Explorer
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Transaction Details</h4>
                  
                  <div className="bg-slate-800/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
                    <div className="font-mono text-sm text-white break-all">
                      {log.txHash}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Gas Used</div>
                      <div className="text-sm text-white font-medium">
                        {log.gasUsed.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <div className="text-xs text-slate-400 mb-1">Network</div>
                      <div className="text-sm text-white font-medium">
                        {log.network}
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Hash Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                    <FaFingerprint className="mr-2 text-cyan-400" />
                    File Integrity
                  </h4>
                  
                  <div className="bg-slate-800/30 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">SHA256 Hash</div>
                    <div className="font-mono text-sm text-white break-all">
                      {log.fileHash}
                    </div>
                  </div>
                  
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center text-green-400 text-sm">
                      <FaShieldAlt className="mr-2" />
                      Hash verified on blockchain
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      File integrity guaranteed by blockchain immutability
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Blockchain Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Blockchain Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {logs.filter(log => log.status === 'confirmed').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Confirmed Transactions</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {logs.filter(log => log.status === 'pending').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Pending Transactions</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {logs.reduce((sum, log) => sum + log.gasUsed, 0).toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">Total Gas Used</div>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {logs.filter(log => log.action === 'VERIFY').length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Verification Checks</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BlockchainLog;
