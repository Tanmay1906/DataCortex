import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaEllipsisV, FaDownload, FaArchive, FaFileExport, FaCheck } from 'react-icons/fa';
import { deleteCase, completeCase } from '../../../services/cases';
import { exportCaseToPDF } from '../../../utils/pdfExport';
import ConfirmationModal from '../../Modals/ConfirmationModal';
import CaseCompletionModal from '../CaseCompletionModal';
import Toast from '../../ui/Toast';

const CaseActions = ({ caseData, onUpdate, onDelete, evidenceData = [] }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCase(caseData.id);
      onDelete();
    } catch (error) {
      console.error('Error deleting case:', error);
      // TODO: Show error toast/notification
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };
  const handleExport = async () => {
    try {
      setIsExporting(true);
      setShowActionsMenu(false);
      
      const result = await exportCaseToPDF(caseData, evidenceData);
      
      if (result.success) {
        setToast({
          type: 'success',
          message: `PDF exported successfully: ${result.filename}`
        });
      } else {
        setToast({
          type: 'error',
          message: `Failed to export PDF: ${result.error}`
        });
      }
    } catch (error) {
      console.error('Error exporting case:', error);
      setToast({
        type: 'error',
        message: 'An unexpected error occurred while exporting'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleArchive = () => {
    // TODO: Implement case archiving functionality
    console.log('Archive case:', caseData.id);
    setShowActionsMenu(false);
  };

  const handleComplete = async (completionData) => {
    try {
      setIsCompleting(true);
      const result = await completeCase(caseData.id, completionData);
      
      setToast({
        type: 'success',
        message: 'Case marked as complete successfully'
      });
      
      setShowCompletionModal(false);
      
      // Call onUpdate to refresh the case data
      if (onUpdate) {
        onUpdate(result.case);
      }
      
    } catch (error) {
      console.error('Error completing case:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.msg || 'Failed to complete case'
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        {/* Primary Actions */}
        {/* Complete Case Button - only show if case is not already completed */}
        {!caseData?.is_completed && (
          <button
            onClick={() => setShowCompletionModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
          >
            <FaCheck className="mr-2" />
            Mark Complete
          </button>
        )}

        <button
          onClick={() => setShowDeleteModal(true)}
          disabled={caseData?.is_completed}
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
            caseData?.is_completed 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <FaTrash className="mr-2" />
          Delete
        </button>

        {/* More Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="inline-flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
          >
            <FaEllipsisV />
          </button>

          {showActionsMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 border border-slate-700/50 rounded-xl shadow-2xl backdrop-blur-lg z-50">
              <div className="py-2">
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFileExport className="mr-3" />
                  {isExporting ? 'Generating PDF...' : 'Export Case Report'}
                </button>
                
                <button
                  onClick={handleArchive}
                  className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                >
                  <FaArchive className="mr-3" />
                  Archive Case
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirm Case Deletion"
        confirmText={isDeleting ? 'Deleting...' : 'Delete Case'}
        confirmColor="red"
        isConfirming={isDeleting}
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to delete case <span className="font-semibold text-white">"{caseData?.title}"</span>?
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Warning:</strong> This action cannot be undone. All associated evidence, blockchain records, and audit trails will be permanently removed.
            </p>
          </div>
        </div>
      </ConfirmationModal>

      {/* Case Completion Modal */}
      <CaseCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={handleComplete}
        caseData={caseData}
        isCompleting={isCompleting}
      />

      {/* Click Outside Handler */}
      {showActionsMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowActionsMenu(false)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default CaseActions;
