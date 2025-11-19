import { FaFileAlt, FaDownload, FaLink, FaList, FaPlus, FaEye } from 'react-icons/fa';
import { Shield } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ChainOfCustody from './ChainOfCustody';
import LogCustodyAction from './LogCustodyAction';
import EvidenceDetails from './EvidenceDetails';
import { logCustodyAction } from '../../services/chainOfCustody';
import { downloadEvidence } from '../../services/evidence';
import { toast } from 'react-hot-toast';

const EvidenceCard = ({ evidence }) => {
  const fileType = evidence.filename?.split('.').pop()?.toUpperCase() || 'FILE';
  const [showCustodyChain, setShowCustodyChain] = useState(false);
  const [showLogAction, setShowLogAction] = useState(false);
  const [showEvidenceDetails, setShowEvidenceDetails] = useState(false);

  const handleCustodyActionLogged = () => {
    // You might want to refresh the evidence data here
    setShowLogAction(false);
  };

  const handleViewDetails = () => {
    setShowEvidenceDetails(true);
  };

  const handlePreview = async () => {
    try {
      // Use the authenticated service to fetch the file
      const blob = await downloadEvidence(evidence.id);
      
      // Create a blob URL for viewing
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      
      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      
      // Log the preview action
      await logCustodyAction(evidence.id, {
        action: 'viewed',
        action_description: 'Evidence file previewed by user',
        location: 'Evidence Card',
        tool_used: 'Web Browser'
      });
      
      toast.success('File preview opened');
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.error('Failed to preview file');
      // Fallback to details modal
      setShowEvidenceDetails(true);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-gradient-to-r from-slate-800/90 via-blue-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl border border-cyan-500/20 shadow-xl evidence-card-container flex flex-col"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start flex-1">
          <div className="p-4 rounded-xl bg-cyan-500/20 text-cyan-400 mr-6 border border-cyan-500/30 flex-shrink-0">
            <FaFileAlt size={24} />
          </div>
          <div className="flex-1 min-h-0">
            <h3 className="font-bold text-slate-200 text-lg mb-2 truncate">{evidence.filename || evidence.originalName}</h3>
            <div className="flex items-center text-slate-400 mb-3 flex-wrap gap-2">
              <span className="bg-slate-700/50 px-3 py-1 rounded-lg text-sm font-medium">{fileType}</span>
              <span className="text-slate-600">•</span>
              <span className="text-sm">{formatFileSize(evidence.size || evidence.file_size || 0)}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm line-clamp-3">
              {evidence.description || 'No description provided'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono bg-slate-700/50 text-slate-300 border border-slate-600/50 truncate max-w-full">
            SHA256: {evidence.sha256?.substring(0, 8)}...{evidence.sha256?.substring(-8)}
          </span>
          {evidence.blockchainTxHash && (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-mono bg-purple-900/30 text-purple-300 border border-purple-500/30 truncate">
              <FaLink className="mr-1 flex-shrink-0" />
              TX: {evidence.blockchainTxHash.substring(0, 6)}...
            </span>
          )}
        </div>
      </div>

      <div className="bg-slate-800/50 px-6 py-4 border-t border-slate-600/30 mt-auto">
        <div className="flex flex-col gap-3">
          <div className="text-slate-400 text-xs">
            <span>Uploaded: {new Date(evidence.uploadedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleViewDetails}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 text-xs px-3 py-1"
            >
              <FaEye className="h-3 w-3" />
              <span>Details</span>
            </Button>
            <Button
              onClick={handlePreview}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs px-3 py-1"
            >
              <FaEye className="h-3 w-3" />
              <span>Preview</span>
            </Button>
            <Button
              onClick={() => setShowCustodyChain(true)}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs px-3 py-1"
            >
              <Shield className="h-3 w-3" />
              <span>Chain</span>
            </Button>
            <Button
              onClick={() => setShowLogAction(true)}
              size="sm"
              variant="outline"
              className="flex items-center space-x-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs px-3 py-1"
            >
              <FaPlus className="h-3 w-3" />
              <span>Log</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Evidence Details Modal */}
      {showEvidenceDetails && (
        <EvidenceDetails
          evidence={evidence}
          onClose={() => setShowEvidenceDetails(false)}
          onActionLogged={handleCustodyActionLogged}
        />
      )}

      {/* Chain of Custody Modal */}
      {showCustodyChain && (
        <ChainOfCustody
          evidenceId={evidence.id}
          caseId={evidence.caseId}
          onClose={() => setShowCustodyChain(false)}
        />
      )}

      {/* Log Custody Action Modal */}
      {showLogAction && (
        <LogCustodyAction
          evidenceId={evidence.id}
          evidenceFilename={evidence.filename || evidence.originalName}
          onClose={() => setShowLogAction(false)}
          onActionLogged={handleCustodyActionLogged}
        />
      )}
    </motion.div>
  );
};

export default EvidenceCard;