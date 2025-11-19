import { useState } from 'react';
import { FaCheck, FaTimes, FaUser, FaBriefcase, FaKey, FaStickyNote } from 'react-icons/fa';

const CaseCompletionModal = ({ isOpen, onClose, onConfirm, caseData, isCompleting = false }) => {
  const [formData, setFormData] = useState({
    completedByName: '',
    completedByPosition: '',
    authorization: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.completedByName.trim()) {
      newErrors.completedByName = 'Name is required';
    }
    
    if (!formData.completedByPosition.trim()) {
      newErrors.completedByPosition = 'Position is required';
    }
    
    if (!formData.authorization.trim()) {
      newErrors.authorization = 'Authorization is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onConfirm(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      completedByName: '',
      completedByPosition: '',
      authorization: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800/95 border border-slate-700/50 rounded-2xl shadow-2xl backdrop-blur-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <FaCheck className="text-green-400 text-lg" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Complete Case</h3>
                <p className="text-slate-400 text-sm">
                  Mark "{caseData?.title}" as completed
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Case Info */}
          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Case Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Case Number:</span>
                <span className="text-white ml-2 font-mono">{caseData?.caseNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Current Status:</span>
                <span className="text-white ml-2 capitalize">{caseData?.status}</span>
              </div>
            </div>
          </div>

          {/* Completion Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <FaUser className="inline mr-2" />
                Completed By (Name) *
              </label>
              <input
                type="text"
                value={formData.completedByName}
                onChange={(e) => handleInputChange('completedByName', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.completedByName 
                    ? 'border-red-500 focus:ring-red-400/20' 
                    : 'border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="Enter the name of the person completing this case"
              />
              {errors.completedByName && (
                <p className="text-red-400 text-sm mt-1">{errors.completedByName}</p>
              )}
            </div>

            {/* Position Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <FaBriefcase className="inline mr-2" />
                Position/Title *
              </label>
              <input
                type="text"
                value={formData.completedByPosition}
                onChange={(e) => handleInputChange('completedByPosition', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.completedByPosition 
                    ? 'border-red-500 focus:ring-red-400/20' 
                    : 'border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="Enter position/title (e.g., Senior Investigator, Detective, etc.)"
              />
              {errors.completedByPosition && (
                <p className="text-red-400 text-sm mt-1">{errors.completedByPosition}</p>
              )}
            </div>

            {/* Authorization Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <FaKey className="inline mr-2" />
                Authorization/Badge Number *
              </label>
              <input
                type="text"
                value={formData.authorization}
                onChange={(e) => handleInputChange('authorization', e.target.value)}
                className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl text-white focus:outline-none focus:ring-2 transition-all duration-300 ${
                  errors.authorization 
                    ? 'border-red-500 focus:ring-red-400/20' 
                    : 'border-slate-600/50 focus:border-blue-400 focus:ring-blue-400/20'
                }`}
                placeholder="Enter badge number, authorization code, or department ID"
              />
              {errors.authorization && (
                <p className="text-red-400 text-sm mt-1">{errors.authorization}</p>
              )}
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                <FaStickyNote className="inline mr-2" />
                Completion Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300 resize-vertical"
                placeholder="Optional notes about the case completion..."
              />
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              ⚠️ <strong>Important:</strong> Once marked as complete, this case status will be permanently changed. 
              This action will be logged and cannot be easily undone.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCompleting}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors duration-200 flex items-center space-x-2"
            >
              <FaCheck className="text-sm" />
              <span>{isCompleting ? 'Completing...' : 'Complete Case'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseCompletionModal;
