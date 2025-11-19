import { Link } from 'react-router-dom';
import { 
  FaFolder, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaFingerprint, 
  FaTrash,
  FaEllipsisV
} from 'react-icons/fa';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { deleteCase } from '../../services/cases';
import { useState, useCallback, memo } from 'react';
import Tooltip from '../Tooltip';
import ConfirmationModal from '../Modals/ConfirmationModal';

// Memoized status icons and colors to prevent unnecessary recalculations
const statusIcons = {
  urgent: <FaExclamationTriangle className="text-red-400" />,
  low: <FaClock className="text-green-400" />,
  all: <FaShieldAlt className="text-blue-400" />,
  open: <FaClock className="text-green-400" />,
  closed: <FaCheckCircle className="text-emerald-400" />,
  pending: <FaClock className="text-yellow-400" />,
  active: <FaShieldAlt className="text-blue-400" />,
  completed: <FaCheckCircle className="text-green-400" />,
};

const statusColors = {
  urgent: 'from-red-500/20 to-pink-500/20 border-red-400/30',
  low: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  all: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
  open: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  closed: 'from-emerald-500/20 to-green-500/20 border-emerald-400/30',
  pending: 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30',
  active: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
  completed: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
};

const priorityLevels = {
  urgent: { label: 'Urgent', color: 'bg-red-400' },
  low: { label: 'Low', color: 'bg-green-400' },
  all: { label: 'Normal', color: 'bg-blue-400' },
  open: { label: 'Active', color: 'bg-blue-400' },
  closed: { label: 'Closed', color: 'bg-emerald-400' },
  pending: { label: 'Pending', color: 'bg-yellow-400' },
  active: { label: 'Active', color: 'bg-blue-400' },
  completed: { label: 'Completed', color: 'bg-green-400' },
};

const CaseCard = memo(({ caseItem, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deleteCase(caseItem.id);
      onDelete?.(caseItem.id);
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  }, [caseItem.id, onDelete]);

  const toggleMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  }, []);

  const openDeleteModal = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  }, []);

  return (
    <>
      <Link
        to={`/cases/${caseItem.id}`}
        className="group block relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
        aria-label={`Case ${caseItem.title}`}
      >
        {/* Main Card Container */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 
                        backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden
                        transform transition-all duration-300 ease-out
                        hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10
                        hover:border-blue-400/30 hover:via-slate-700/90
                        active:scale-[0.99] active:duration-100">
          
          {/* Performance optimized background animation */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent 
                            transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] 
                            transition-transform duration-1000 ease-out will-change-transform"></div>
          </div>
          
          {/* Status Indicator Bar */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${statusColors[caseItem.status]}`}></div>
          
          <div className="relative p-6 z-10">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center min-w-0">
                {/* Case Icon */}
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 
                                border border-blue-400/30 mr-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <FaFolder className="text-blue-400 text-lg" />
                </div>
                
                <div className="min-w-0">
                  <Tooltip content={caseItem.title} disabled={caseItem.title.length < 30}>
                    <h3 className="text-lg font-bold text-white truncate mb-1 group-hover:text-blue-300 
                                 transition-colors duration-300">
                      {caseItem.title}
                    </h3>
                  </Tooltip>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-slate-400 font-mono truncate">
                      Case #{caseItem.caseNumber}
                    </p>
                    <div className="h-1 w-1 bg-slate-500 rounded-full"></div>
                    <div className="flex items-center text-xs text-slate-500 truncate">
                      <FaShieldAlt className="mr-1 shrink-0" />
                      <span className="truncate">CLASSIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-2">
                {/* More Options Button */}
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 
                             hover:bg-slate-700/70 hover:text-white transition-all duration-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  aria-label="More options"
                >
                  <FaEllipsisV className="text-sm" />
                </button>
                
                {/* Status Badge */}
                <div className={`flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${statusColors[caseItem.status]} 
                                 border border-slate-600/30 backdrop-blur-sm`}>
                  <div className="mr-2">
                    {statusIcons[caseItem.status]}
                  </div>
                  <span className="text-xs font-semibold capitalize text-white truncate max-w-[80px]">
                    {caseItem.status}
                  </span>
                </div>
                
                {/* Completion Badge */}
                {caseItem.is_completed && (
                  <div className="flex items-center px-2 py-1 rounded-md bg-green-500/20 border border-green-400/30">
                    <FaCheckCircle className="text-green-400 text-xs mr-1" />
                    <span className="text-xs font-medium text-green-300">Completed</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description with truncation */}
            <div className="mb-4">
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 group-hover:text-slate-200 
                            transition-colors duration-300">
                {caseItem.description || 'No description provided'}
              </p>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {/* Evidence Count */}
                <div className="flex items-center px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-600/30
                                group-hover:bg-slate-700/50 transition-all duration-200">
                  <FaFingerprint className="text-cyan-400 mr-2 text-xs" />
                  <span className="text-xs font-semibold text-white">
                    {caseItem.evidence_count || caseItem.evidenceCount || 0}
                  </span>
                  <span className="text-xxs text-slate-400 ml-1">items</span>
                </div>
                
                {/* Priority Indicator */}
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 animate-pulse ${priorityLevels[caseItem.status]?.color || 'bg-blue-400'}`}></div>
                  <span className="text-xxs text-slate-400 uppercase tracking-wider">
                    {priorityLevels[caseItem.status]?.label || 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-700/50 gap-y-2">
              <div className="flex items-center space-x-3 text-xxs text-slate-500">
                <div className="flex items-center">
                  <span className="mr-1">Created:</span>
                  <time className="font-mono text-slate-400" dateTime={caseItem.created_at || ''}>
                    {formatDate(caseItem.created_at) || 'No date'}
                  </time>
                </div>
              </div>
              
              <div className="flex items-center text-xxs text-slate-500">
                <span className="mr-1">Updated:</span>
                <time className="font-mono text-slate-400" dateTime={caseItem.updated_at || ''}>
                  {formatRelativeTime(caseItem.updated_at) || 'No date'}
                </time>
              </div>
            </div>
          </div>

          {/* Context Menu (conditionally rendered) */}
          {isMenuOpen && (
            <div 
              className="absolute right-4 top-14 z-20 bg-slate-800/95 border border-slate-700/50 rounded-xl shadow-2xl shadow-black/50 backdrop-blur-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={openDeleteModal}
                className="flex items-center px-4 py-3 w-full text-left text-red-400 hover:bg-slate-700/50 transition-colors duration-150"
              >
                <FaTrash className="mr-3 text-sm" />
                <span className="text-sm">Delete Case</span>
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        confirmColor="red"
        isConfirming={isDeleting}
      >
        <p className="text-slate-300">
          Are you sure you want to delete case <span className="font-semibold text-white">"{caseItem.title}"</span>? 
          This action cannot be undone and all associated evidence will be permanently removed.
        </p>
      </ConfirmationModal>
    </>
  );
});

CaseCard.displayName = 'CaseCard';

export default CaseCard;