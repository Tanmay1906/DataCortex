import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFile, 
  FaDownload, 
  FaEye, 
  FaFingerprint, 
  FaClock, 
  FaUser,
  FaShieldAlt,
  FaSearch,
  FaFilter,
  FaSort,
  FaPlus,
  FaTrash,
  FaSpinner,
  FaHistory,
  FaEdit
} from 'react-icons/fa';
import { formatDate, formatRelativeTime } from '../../../../utils/helpers';
import EvidenceDetails from '../../../evidence/EvidenceDetails';
import ChainOfCustody from '../../../evidence/ChainOfCustody';
import LogCustodyAction from '../../../evidence/LogCustodyAction';
import { logCustodyAction } from '../../../../services/chainOfCustody';
import { downloadEvidence } from '../../../../services/evidence';
import { toast } from 'react-hot-toast';

const EvidenceList = ({ caseId, caseData, onEvidenceAdded }) => {
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  
  // Modal states
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showEvidenceDetails, setShowEvidenceDetails] = useState(false);
  const [showCustodyChain, setShowCustodyChain] = useState(false);
  const [showLogAction, setShowLogAction] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  // Fetch evidence from API
  useEffect(() => {
    fetchEvidence();
  }, [caseId]);

  const fetchEvidence = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/evidence/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEvidenceList(data);
      } else {
        console.error('Failed to fetch evidence');
        setEvidenceList([]);
      }
    } catch (error) {
      console.error('Error fetching evidence:', error);
      setEvidenceList([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvidence = async (evidenceId) => {
    // Prevent deletion if case is completed
    if (caseData?.is_completed) {
      toast.error('Cannot delete evidence from a completed case');
      return;
    }

    if (!confirm('Are you sure you want to delete this evidence? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/evidence/${evidenceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Log deletion action
        try {
          await logCustodyAction(evidenceId, {
            action: 'deleted',
            action_description: 'Evidence file deleted by user',
            location: 'Evidence List'
          });
        } catch (error) {
          console.error('Error logging deletion:', error);
        }
        
        // Remove from local state
        setEvidenceList(prev => prev.filter(e => e.id !== evidenceId));
        toast.success('Evidence deleted successfully');
      } else {
        const error = await response.json();
        toast.error('Failed to delete evidence: ' + error.msg);
      }
    } catch (error) {
      console.error('Error deleting evidence:', error);
      toast.error('Failed to delete evidence');
    }
  };

  const handleViewEvidence = (evidence) => {
    setSelectedEvidence(evidence);
    setShowEvidenceDetails(true);
  };

  const handleShowCustodyChain = (evidence) => {
    setSelectedEvidence(evidence);
    setShowCustodyChain(true);
  };

  const handleLogAction = (evidence) => {
    // Prevent logging actions if case is completed
    if (caseData?.is_completed) {
      toast.error('Cannot log actions on evidence from a completed case');
      return;
    }
    
    setSelectedEvidence(evidence);
    setShowLogAction(true);
  };

  const handleDownload = async (evidence) => {
    const evidenceId = evidence.id;
    
    try {
      setActionLoading(prev => ({ ...prev, [evidenceId]: 'downloading' }));
      
      // Log the download action
      await logCustodyAction(evidenceId, {
        action: 'downloaded',
        action_description: 'Evidence file downloaded by user',
        location: 'Evidence List',
        tool_used: 'Web Browser'
      });

      // Download using authenticated service
      const blob = await downloadEvidence(evidenceId);
      
      // Create a download link
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = evidence.originalName || evidence.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);

      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading evidence:', error);
      toast.error('Failed to download evidence');
    } finally {
      setActionLoading(prev => ({ ...prev, [evidenceId]: null }));
    }
  };

  const handleActionLogged = () => {
    // Refresh the evidence list when an action is logged
    // Use a timeout to prevent rapid successive calls
    setTimeout(() => {
      fetchEvidence();
    }, 100);
    setShowLogAction(false);
  };

  // Update evidence list when new evidence is added
  useEffect(() => {
    if (onEvidenceAdded) {
      fetchEvidence(); // Refresh the list
    }
  }, [onEvidenceAdded]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return '📁';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦';
    if (mimeType.includes('email') || mimeType.includes('message')) return '📧';
    return '📁';
  };

  const getStatusBadge = (status) => {
    const badges = {
      verified: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Verified' },
      processing: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Processing' },
      failed: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Failed' },
      active: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Active' }
    };
    return badges[status] || badges.active;
  };

  const filteredAndSortedEvidence = evidenceList
    .filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sha256.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
        (item.mimeType && item.mimeType.includes(filterType));
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'uploadedAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-2xl text-blue-400 mr-3" />
        <span className="text-slate-300">Loading evidence...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Evidence Files</h3>
          <p className="text-slate-400">
            Digital evidence collected and verified for this case
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
            <option value="email">Emails</option>
            <option value="archive">Archives</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="uploadedAt-desc">Newest First</option>
            <option value="uploadedAt-asc">Oldest First</option>
            <option value="filename-asc">Name A-Z</option>
            <option value="filename-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>
        </div>
      </div>

      {/* Evidence Grid */}
      {filteredAndSortedEvidence.length === 0 ? (
        <div className="text-center py-12">
          <FaFile className="mx-auto text-4xl text-slate-500 mb-4" />
          <h4 className="text-lg font-medium text-slate-300 mb-2">No Evidence Found</h4>
          <p className="text-slate-500">
            {searchTerm || filterType !== 'all' 
              ? 'No evidence matches your search criteria' 
              : 'No evidence has been uploaded for this case yet'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-800/50 border-b border-slate-700/50 text-sm font-medium text-slate-300">
              <div className="col-span-4">File</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Uploaded</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Actions</div>
            </div>
            
            {/* Table Body */}
            <div className="divide-y divide-slate-700/50">
              {filteredAndSortedEvidence.map((item, index) => {
                const statusInfo = getStatusBadge(item.status);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-800/30 transition-colors"
                  >
                    {/* File Info */}
                    <div className="col-span-4 flex items-center space-x-3">
                      <div className="text-2xl">
                        {getFileIcon(item.mimeType)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-white truncate">
                          {item.originalName || item.filename}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <FaFingerprint className="text-green-400 text-xs" />
                          <span className="text-xs text-slate-400 font-mono">
                            {item.sha256.substring(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Size */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-slate-300">
                        {formatFileSize(item.size || 0)}
                      </span>
                    </div>
                    
                    {/* Upload Info */}
                    <div className="col-span-2 flex items-center">
                      <div>
                        <div className="text-sm text-slate-300">
                          {formatRelativeTime(item.uploadedAt)}
                        </div>
                        <div className="text-xs text-slate-500">
                          by {item.uploadedBy}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <button
                        onClick={() => handleViewEvidence(item)}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDownload(item)}
                        disabled={actionLoading[item.id] === 'downloading'}
                        className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Download"
                      >
                        {actionLoading[item.id] === 'downloading' ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaDownload />
                        )}
                      </button>
                      <button
                        onClick={() => handleShowCustodyChain(item)}
                        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                        title="Chain of Custody"
                      >
                        <FaHistory />
                      </button>
                      <button
                        onClick={() => handleLogAction(item)}
                        disabled={caseData?.is_completed}
                        className={`p-2 rounded-lg transition-colors ${
                          caseData?.is_completed 
                            ? 'text-slate-600 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10'
                        }`}
                        title={caseData?.is_completed ? "Cannot log actions - case completed" : "Log Action"}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteEvidence(item.id)}
                        disabled={caseData?.is_completed}
                        className={`p-2 rounded-lg transition-colors ${
                          caseData?.is_completed 
                            ? 'text-slate-600 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                        }`}
                        title={caseData?.is_completed ? "Cannot delete - case completed" : "Delete"}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Evidence Details Modal */}
      {showEvidenceDetails && selectedEvidence && (
        <EvidenceDetails
          evidence={selectedEvidence}
          onClose={() => {
            setShowEvidenceDetails(false);
            setSelectedEvidence(null);
          }}
          onActionLogged={handleActionLogged}
        />
      )}

      {/* Chain of Custody Modal */}
      {showCustodyChain && selectedEvidence && (
        <ChainOfCustody
          evidenceId={selectedEvidence.id}
          caseId={caseId}
          onClose={() => {
            setShowCustodyChain(false);
            setSelectedEvidence(null);
          }}
        />
      )}

      {/* Log Custody Action Modal */}
      {showLogAction && selectedEvidence && (
        <LogCustodyAction
          evidenceId={selectedEvidence.id}
          evidenceFilename={selectedEvidence.originalName || selectedEvidence.filename}
          onClose={() => {
            setShowLogAction(false);
            setSelectedEvidence(null);
          }}
          onActionLogged={handleActionLogged}
        />
      )}
    </div>
  );
};

export default EvidenceList;
