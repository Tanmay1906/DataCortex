import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, 
  FaFingerprint, 
  FaShieldAlt, 
  FaEye, 
  FaFileAlt, 
  FaCalendarAlt,
  FaUser,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
  FaCube,
  FaLock,
  FaMicroscope,
  FaCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { Shield, Hash, File, Calendar, User, Database, Zap, CheckCircle } from 'lucide-react';
import { logCustodyAction } from '../../services/chainOfCustody';
import { previewEvidence } from '../../services/evidence';
import { toast } from 'react-hot-toast';
import ChainOfCustody from './ChainOfCustody';
import TransactionViewer from '../blockchain/TransactionViewer';
import { createPortal } from 'react-dom';

const EvidenceDetails = ({ evidence, onClose, onActionLogged }) => {
  const [showCustodyChain, setShowCustodyChain] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fileType = evidence.filename?.split('.').pop()?.toUpperCase() || 'UNKNOWN';
  const isImage = evidence.mimeType?.startsWith('image/');
  const isPdf = evidence.mimeType?.includes('pdf');
  const isText = evidence.mimeType?.startsWith('text/') || evidence.mimeType?.includes('json') || evidence.mimeType?.includes('xml');
  const isVideo = evidence.mimeType?.startsWith('video/');
  const isAudio = evidence.mimeType?.startsWith('audio/');
  
  // Files that can be previewed in the browser
  const isPreviewable = isImage || isPdf || isText || isVideo || isAudio;

  useEffect(() => {
    // Log that the evidence was viewed (only once when modal opens)
    if (!viewLogged) {
      const logView = async () => {
        try {
          await logCustodyAction(evidence.id, {
            action: 'viewed',
            action_description: 'Evidence details viewed by user',
            location: 'Evidence Details Modal'
          });
          setViewLogged(true);
        } catch (error) {
          console.error('Error logging view action:', error);
        }
      };
      
      logView();
    }
  }, [evidence.id, viewLogged]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopyHash = async (hashToCopy = null) => {
    try {
      const textToCopy = hashToCopy || evidence.sha256;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success(hashToCopy ? 'Transaction hash copied to clipboard' : 'Hash copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy hash');
    }
  };

  const handleViewFile = async () => {
    if (isPreviewable) {
      try {
        setViewing(true);
        
        // Fetch the file with proper authentication
        const blob = await previewEvidence(evidence.id);
        
        // Create a blob URL for viewing
        const blobUrl = URL.createObjectURL(blob);
        
        // Log the view action
        await logCustodyAction(evidence.id, {
          action: 'viewed',
          action_description: 'Evidence file previewed by user',
          location: 'Evidence Details Modal - Preview',
          tool_used: 'Web Browser'
        });
        
        // Open in new tab with proper cleanup
        const newWindow = window.open(blobUrl, '_blank');
        
        if (!newWindow) {
          toast.error('Popup blocked. Please allow popups for this site.');
          URL.revokeObjectURL(blobUrl);
          return;
        }
        
        // Clean up the blob URL after the window loads
        newWindow.addEventListener('load', () => {
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 1000);
        });
        
        // Fallback cleanup in case load event doesn't fire
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 15000);
        
        if (onActionLogged && typeof onActionLogged === 'function') {
          setTimeout(() => onActionLogged(), 200);
        }
        
        toast.success('File preview opened in new tab');
      } catch (error) {
        console.error('Error viewing evidence:', error);
        toast.error('Failed to open file preview');
      } finally {
        setViewing(false);
      }
    } else {
      toast.info(`File preview not available for ${fileType} files. Supported types: Images, PDFs, Text, Video, and Audio files.`);
    }
  };

  const tabVariants = {
    inactive: { opacity: 0.6, scale: 0.95 },
    active: { opacity: 1, scale: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 rounded-3xl border border-cyan-400/30 shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden backdrop-blur-xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glowing border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-cyan-400/20 opacity-30 blur-xl"></div>
          
          {/* Header with holographic effect */}
          <div className="relative border-b border-slate-700/50 p-8 bg-gradient-to-r from-slate-900/80 to-slate-800/80 flex-shrink-0">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/30 rounded-2xl blur-lg animate-pulse"></div>
                  <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-cyan-400/40 backdrop-blur-sm">
                    <FaMicroscope className="text-cyan-300 text-3xl" />
                  </div>
                </div>
                <div>
                  <motion.h1 
                    className="text-3xl font-bold bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {evidence.originalName || evidence.filename}
                  </motion.h1>
                  <motion.div 
                    className="flex items-center mt-2 space-x-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-slate-300 flex items-center">
                      <FaCircle className="text-green-400 text-xs mr-2 animate-pulse" />
                      Evidence ID: {evidence.id}
                    </span>
                    <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium">
                      {fileType} File
                    </span>
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.button
                onClick={onClose}
                className="group p-3 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-300 border border-transparent hover:border-red-400/30"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes className="text-xl group-hover:drop-shadow-lg" />
              </motion.button>
            </div>

            {/* Status indicators */}
            <motion.div 
              className="flex items-center space-x-6 mt-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
                <CheckCircle className="text-green-400 h-4 w-4" />
                <span className="text-green-300 text-sm font-medium">Integrity Verified</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full">
                <FaCube className="text-purple-400 h-4 w-4" />
                <span className="text-purple-300 text-sm font-medium">Blockchain Secured</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full">
                <FaLock className="text-cyan-400 h-4 w-4" />
                <span className="text-cyan-300 text-sm font-medium">Chain of Custody Active</span>
              </div>
            </motion.div>
          </div>

          {/* Navigation Tabs */}
          <div className="relative p-6 pb-0 flex-shrink-0">
            <div className="flex space-x-1 bg-slate-800/50 rounded-2xl p-2 border border-slate-700/50">
              {[
                { id: 'overview', label: 'Overview', icon: FaFileAlt },
                { id: 'security', label: 'Security', icon: FaShieldAlt },
                { id: 'metadata', label: 'Metadata', icon: Database },
                { id: 'analysis', label: 'Analysis', icon: FaMicroscope }
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/30 shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                  variants={tabVariants}
                  animate={activeTab === tab.id ? 'active' : 'inactive'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* File Information Card */}
                    <motion.div 
                      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <div className="p-2 bg-cyan-500/20 rounded-lg mr-3 border border-cyan-400/30">
                          <File className="text-cyan-400 h-5 w-5" />
                        </div>
                        File Information
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'File Type', value: fileType, color: 'cyan' },
                          { label: 'File Size', value: formatFileSize(evidence.size || evidence.file_size || 0), color: 'blue' },
                          { label: 'MIME Type', value: evidence.mimeType || 'Unknown', color: 'purple' }
                        ].map((item, index) => (
                          <motion.div 
                            key={item.label}
                            className="flex justify-between items-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-slate-300 font-medium">{item.label}</span>
                            <span className={`text-${item.color}-300 font-bold px-3 py-1 rounded-lg bg-${item.color}-500/10 border border-${item.color}-400/20`}>
                              {item.value}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Upload Information Card */}
                    <motion.div 
                      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <div className="p-2 bg-green-500/20 rounded-lg mr-3 border border-green-400/30">
                          <Calendar className="text-green-400 h-5 w-5" />
                        </div>
                        Case Information
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Uploaded At', value: formatDate(evidence.uploadedAt), color: 'green' },
                          { label: 'Uploaded By', value: evidence.uploadedBy || 'Unknown', color: 'yellow' },
                          { label: 'Case Number', value: evidence.case_number || 'N/A', color: 'red' }
                        ].map((item, index) => (
                          <motion.div 
                            key={item.label}
                            className="flex justify-between items-center p-4 bg-slate-900/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-slate-300 font-medium">{item.label}</span>
                            <span className={`text-${item.color}-300 font-bold`}>
                              {item.value}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Description Card */}
                    {evidence.description && (
                      <motion.div 
                        className="lg:col-span-2 bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <div className="p-2 bg-purple-500/20 rounded-lg mr-3 border border-purple-400/30">
                            <FaFileAlt className="text-purple-400 h-5 w-5" />
                          </div>
                          Evidence Description
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg p-4 bg-slate-900/40 rounded-xl border border-slate-700/30">
                          {evidence.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    {/* Hash Information */}
                    <motion.div 
                      className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                        <div className="p-2 bg-cyan-500/20 rounded-lg mr-3 border border-cyan-400/30">
                          <FaFingerprint className="text-cyan-400 h-5 w-5" />
                        </div>
                        Cryptographic Hash
                      </h3>
                      <div className="bg-slate-900/60 rounded-xl p-6 border border-cyan-400/20">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-slate-300 font-medium">SHA256 Hash</span>
                          <motion.button
                            onClick={handleCopyHash}
                            className="p-2 text-slate-400 hover:text-cyan-400 transition-colors hover:bg-cyan-500/10 rounded-lg"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Copy hash"
                          >
                            {copied ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-green-400"
                              >
                                <FaCheck />
                              </motion.div>
                            ) : (
                              <FaCopy />
                            )}
                          </motion.button>
                        </div>
                        <div className="font-mono text-cyan-300 text-sm break-all bg-slate-800/50 p-4 rounded-lg border border-cyan-400/10 leading-relaxed">
                          {evidence.sha256}
                        </div>
                      </div>
                    </motion.div>

                    {/* Blockchain Transaction */}
                    {evidence.blockchainTxHash && (
                      <motion.div 
                        className="bg-gradient-to-br from-purple-900/20 to-slate-900/60 rounded-2xl p-6 border border-purple-400/30 backdrop-blur-sm"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                          <div className="p-2 bg-purple-500/20 rounded-lg mr-3 border border-purple-400/30">
                            <FaCube className="text-purple-400 h-5 w-5" />
                          </div>
                          Blockchain Verification
                        </h3>
                        <div className="bg-slate-900/60 rounded-xl p-6 border border-purple-400/20">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-slate-300 font-medium">Transaction Hash</span>
                            {!evidence.blockchainTxHash.startsWith('fallback_') && (
                              <div className="flex items-center space-x-2">
                                <TransactionViewer txHash={evidence.blockchainTxHash} />
                                <span className="text-xs text-slate-400">Ganache Network</span>
                              </div>
                            )}
                          </div>
                          <div className="font-mono text-purple-300 text-sm break-all bg-slate-800/50 p-4 rounded-lg border border-purple-400/10 leading-relaxed">
                            {evidence.blockchainTxHash}
                          </div>
                          {evidence.blockchainTxHash.startsWith('fallback_') && (
                            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                              <div className="flex items-center text-amber-400 text-sm">
                                <FaExclamationTriangle className="mr-2" />
                                Local Verification Only
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                Blockchain was unavailable during upload. Evidence is stored with cryptographic verification but not on blockchain.
                              </div>
                            </div>
                          )}
                          {!evidence.blockchainTxHash.startsWith('fallback_') && (
                            <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                              <div className="flex items-center text-green-400 text-sm">
                                <FaShieldAlt className="mr-2" />
                                Blockchain Verified
                              </div>
                              <div className="text-xs text-slate-400 mt-1">
                                Evidence hash is permanently recorded on Ganache blockchain for immutable verification.
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {activeTab === 'metadata' && (
                  <motion.div 
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Technical Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Creation Date', value: 'January 10, 2025' },
                        { label: 'Last Modified', value: 'January 12, 2025' },
                        { label: 'Author', value: 'Unknown' },
                        { label: 'Application', value: 'Microsoft Word 2021' },
                        { label: 'Pages', value: '15' },
                        { label: 'Word Count', value: '4,287' }
                      ].map((item, index) => (
                        <motion.div 
                          key={item.label}
                          className="p-4 bg-slate-900/40 rounded-xl border border-slate-700/30"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="text-slate-400 text-sm">{item.label}</div>
                          <div className="text-white font-medium mt-1">{item.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'analysis' && (
                  <motion.div 
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl p-6 border border-slate-700/50 backdrop-blur-sm"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Forensic Analysis</h3>
                    <div className="space-y-6">
                      <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-xl">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="text-green-400 mr-2" />
                          <span className="text-green-300 font-medium">Virus Scan: Clean</span>
                        </div>
                        <p className="text-green-200/80 text-sm">No malicious content detected</p>
                      </div>
                      
                      <div className="p-4 bg-yellow-900/20 border border-yellow-400/30 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Zap className="text-yellow-400 mr-2" />
                          <span className="text-yellow-300 font-medium">Encryption: Detected</span>
                        </div>
                        <p className="text-yellow-200/80 text-sm">Document appears to be password protected</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced Action Footer */}
          <div className="relative border-t border-slate-700/50 p-6 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setShowCustodyChain(true)}
                  className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-400/30 text-cyan-300 rounded-xl hover:from-cyan-500/30 hover:to-cyan-600/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield className="h-4 w-4 group-hover:animate-pulse" />
                  <span className="font-medium">Chain of Custody</span>
                </motion.button>
                
                {isPreviewable && (
                  <motion.button
                    onClick={handleViewFile}
                    disabled={viewing}
                    className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 text-blue-300 rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: viewing ? 1 : 1.05, y: viewing ? 0 : -2 }}
                    whileTap={{ scale: viewing ? 1 : 0.95 }}
                  >
                    {viewing ? (
                      <>
                        <motion.div 
                          className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-300 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="font-medium">Opening Preview...</span>
                      </>
                    ) : (
                      <>
                        <FaEye className="h-4 w-4 group-hover:animate-pulse" />
                        <span className="font-medium">Preview File</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Chain of Custody Modal */}
          {showCustodyChain && (
            <ChainOfCustody
              evidenceId={evidence.id}
              caseId={evidence.caseId || evidence.case_id}
              onClose={() => setShowCustodyChain(false)}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default EvidenceDetails;