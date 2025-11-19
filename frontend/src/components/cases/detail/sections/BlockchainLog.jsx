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
  FaCopy,
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

  const getGanacheExplorerLink = (txHash) => {
    // For Ganache, we don't have a web explorer, so we'll show transaction details
    // in a modal or copy the hash instead of trying to open a non-existent URL
    return null;
  };

  const handleTransactionClick = (txHash) => {
    // Copy transaction hash to clipboard since Ganache doesn't have a web explorer
    navigator.clipboard.writeText(txHash)
      .then(() => {
        // You could show a toast notification here
        console.log('Transaction hash copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy transaction hash:', err);
      });
  };

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: { 
        color: 'bg-green-500/20 text-green-400 border-green-500/30', 
        icon: <FaCheckCircle />, 
        label: 'Confirmed' 
      },
      pending: { 
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
        icon: <FaSpinner className="animate-spin" />, 
        label: 'Pending' 
      },
      failed: { 
        color: 'bg-red-500/20 text-red-400 border-red-500/30', 
        icon: <FaExclamationTriangle />, 
        label: 'Failed' 
      }
    };
    return badges[status] || badges.pending;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.evidenceHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-blue-400 mr-3" />
        <span className="text-slate-300">Loading blockchain transactions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Blockchain Transaction Log</h3>
          <p className="text-slate-400">
            All evidence transactions recorded on the blockchain for immutable audit trail
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <FaLink className="mx-auto text-4xl text-slate-500 mb-4" />
          <h4 className="text-lg font-medium text-slate-300 mb-2">No Blockchain Transactions</h4>
          <p className="text-slate-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'No transactions match your search criteria' 
              : 'No evidence has been recorded on the blockchain yet'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => {
            const statusInfo = getStatusBadge(log.status);
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Transaction Info */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FaShieldAlt className="text-blue-400" />
                        <h4 className="font-semibold text-white">{log.action}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.label}</span>
                        </span>
                      </div>
                      <span className="text-sm text-slate-400">
                        Block #{log.blockNumber}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300">{log.description}</p>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Transaction Hash</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-mono text-sm text-slate-200">{log.txHash.substring(0, 20)}...</span>
                          <button
                            onClick={() => handleTransactionClick(log.txHash)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded"
                            title="Copy transaction hash to clipboard"
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Evidence Hash</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <FaFingerprint className="text-green-400" />
                          <span className="font-mono text-sm text-green-400">{log.evidenceHash.substring(0, 20)}...</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Timestamp</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <FaClock className="text-slate-400" />
                          <span className="text-sm text-slate-200">{formatDate(log.timestamp)}</span>
                          <span className="text-xs text-slate-500">({formatRelativeTime(log.timestamp)})</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">Gas Used</span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-yellow-400">{log.gasUsed} ETH</span>
                          {log.confirmations && (
                            <span className="text-xs text-slate-500">
                              ({log.confirmations} confirmations)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* From/To Addresses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-700/50">
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">From</span>
                        <div className="font-mono text-sm text-slate-300 mt-1">{log.from}</div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase tracking-wide">To</span>
                        <div className="font-mono text-sm text-slate-300 mt-1">{log.to}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlockchainLog;
