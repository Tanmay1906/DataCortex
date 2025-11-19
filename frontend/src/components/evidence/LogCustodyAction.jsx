import React, { useState, useEffect } from 'react';
import { Shield, User, MapPin, FileText, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { logCustodyAction, getCustodyActions } from '../../services/chainOfCustody';
import { toast } from 'react-hot-toast';

const LogCustodyAction = ({ evidenceId, evidenceFilename, onClose, onActionLogged }) => {
  const [formData, setFormData] = useState({
    action: '',
    action_description: '',
    location: '',
    tool_used: '',
    tool_version: '',
    authorization: '',
    witness: '',
    documentation_ref: '',
    condition_before: '',
    condition_after: '',
    // Transfer specific
    transferred_to: '',
    reason: '',
    // Analysis specific
    findings: '',
    // Verification specific
    computed_hash: '',
    verification_result: true
  });

  const [availableActions, setAvailableActions] = useState([]);
  const [users, setUsers] = useState([]); // You might want to fetch this from an API
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAvailableActions();
  }, []);

  const loadAvailableActions = async () => {
    try {
      setLoading(true);
      const data = await getCustodyActions();
      setAvailableActions(data.actions || []);
    } catch (error) {
      console.error('Error loading custody actions:', error);
      toast.error('Failed to load custody actions');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.action) {
      toast.error('Please select an action');
      return;
    }

    if (formData.action === 'transferred' && !formData.transferred_to) {
      toast.error('Please specify the recipient for transfer');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare the action data
      const actionData = {
        action: formData.action,
        action_description: formData.action_description || `${formData.action} action on evidence`,
        location: formData.location,
        tool_used: formData.tool_used,
        tool_version: formData.tool_version,
        authorization: formData.authorization,
        witness: formData.witness,
        documentation_ref: formData.documentation_ref,
        condition_before: formData.condition_before,
        condition_after: formData.condition_after
      };

      // Add action-specific data
      if (formData.action === 'transferred') {
        actionData.transferred_to = parseInt(formData.transferred_to);
        actionData.reason = formData.reason;
      } else if (formData.action === 'analyzed') {
        actionData.findings = formData.findings;
      } else if (formData.action === 'verified') {
        actionData.computed_hash = formData.computed_hash;
        actionData.verification_result = formData.verification_result;
      }

      await logCustodyAction(evidenceId, actionData);
      
      toast.success('Custody action logged successfully');
      
      if (onActionLogged) {
        onActionLogged();
      }
      
      onClose();
      
    } catch (error) {
      console.error('Error logging custody action:', error);
      toast.error(error.response?.data?.error || 'Failed to log custody action');
    } finally {
      setSubmitting(false);
    }
  };

  const getActionFields = () => {
    switch (formData.action) {
      case 'transferred':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer To (User ID) *
              </label>
              <input
                type="number"
                name="transferred_to"
                value={formData.transferred_to}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter user ID"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Reason
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Reason for transfer"
              />
            </div>
          </>
        );
      
      case 'analyzed':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analysis Findings
            </label>
            <textarea
              name="findings"
              value={formData.findings}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the analysis findings..."
            />
          </div>
        );
      
      case 'verified':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Computed Hash
              </label>
              <input
                type="text"
                name="computed_hash"
                value={formData.computed_hash}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="SHA256 hash"
              />
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="verification_result"
                  checked={formData.verification_result}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Verification Successful
                </span>
              </label>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Log Custody Action</h2>
              <p className="text-gray-600 mt-1">Evidence: {evidenceFilename}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Action Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type *
              </label>
              <select
                name="action"
                value={formData.action}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select an action...</option>
                {availableActions.map(action => (
                  <option key={action.value} value={action.value}>
                    {action.label} - {action.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="action_description"
                value={formData.action_description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the action being performed..."
              />
            </div>

            {/* Action-specific fields */}
            {getActionFields()}

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Physical or logical location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Tool Used
                </label>
                <input
                  type="text"
                  name="tool_used"
                  value={formData.tool_used}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Software or tool name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tool Version
                </label>
                <input
                  type="text"
                  name="tool_version"
                  value={formData.tool_version}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Version number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Authorization
                </label>
                <input
                  type="text"
                  name="authorization"
                  value={formData.authorization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Legal authorization reference"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Witness
                </label>
                <input
                  type="text"
                  name="witness"
                  value={formData.witness}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Witness name and details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentation Ref
                </label>
                <input
                  type="text"
                  name="documentation_ref"
                  value={formData.documentation_ref}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="External documentation reference"
                />
              </div>
            </div>

            {/* Condition Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition Before
                </label>
                <input
                  type="text"
                  name="condition_before"
                  value={formData.condition_before}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Evidence condition before action"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition After
                </label>
                <input
                  type="text"
                  name="condition_after"
                  value={formData.condition_after}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Evidence condition after action"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !formData.action}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Logging...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Log Action
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogCustodyAction;
