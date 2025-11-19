import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, Shield, AlertTriangle, CheckCircle, Download, Eye, Upload, ArrowRight } from 'lucide-react';
import { getEvidenceCustodyChain, verifyEvidenceIntegrity, logCustodyAction } from '../../services/chainOfCustody';
import { toast } from 'react-hot-toast';

const ChainOfCustody = ({ evidenceId, caseId, onClose }) => {
  const [custodyChain, setCustodyChain] = useState([]);
  const [summary, setSummary] = useState(null);
  const [evidenceInfo, setEvidenceInfo] = useState(null);
  const [integrity, setIntegrity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewLogged, setViewLogged] = useState(false);

  useEffect(() => {
    if (evidenceId) {
      loadCustodyChain();
      loadIntegrityStatus();
      // Log view action only once when modal opens
      if (!viewLogged) {
        logViewAction();
      }
    }
  }, [evidenceId, viewLogged]); // Only run when evidenceId changes or not yet logged

  const logViewAction = async () => {
    try {
      await logCustodyAction(evidenceId, {
        action: 'viewed',
        action_description: 'Chain of custody viewed by user',
        location: 'Chain of Custody Modal'
      });
      setViewLogged(true);
    } catch (error) {
      console.error('Error logging view action:', error);
    }
  };

  const loadCustodyChain = async () => {
    try {
      setLoading(true);
      const data = await getEvidenceCustodyChain(evidenceId, caseId);
      setCustodyChain(data.custody_chain || []);
      setSummary(data.summary || {});
      setEvidenceInfo({
        filename: data.evidence_filename,
        case_id: data.case_id,
        evidence_id: data.evidence_id
      });
    } catch (error) {
      console.error('Error loading custody chain:', error);
      setError('Failed to load chain of custody');
      toast.error('Failed to load chain of custody');
    } finally {
      setLoading(false);
    }
  };

  const loadIntegrityStatus = async () => {
    try {
      const data = await verifyEvidenceIntegrity(evidenceId, caseId);
      setIntegrity(data.integrity);
    } catch (error) {
      console.error('Error verifying integrity:', error);
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'uploaded':
        return <Upload className="h-4 w-4 text-blue-500" />;
      case 'viewed':
        return <Eye className="h-4 w-4 text-green-500" />;
      case 'downloaded':
        return <Download className="h-4 w-4 text-purple-500" />;
      case 'transferred':
        return <ArrowRight className="h-4 w-4 text-orange-500" />;
      case 'analyzed':
        return <Shield className="h-4 w-4 text-indigo-500" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIntegrityBadge = () => {
    if (!integrity) return null;

    const statusColors = {
      verified: 'bg-green-100 text-green-800',
      compromised: 'bg-red-100 text-red-800',
      unknown: 'bg-gray-100 text-gray-800',
      incomplete: 'bg-yellow-100 text-yellow-800'
    };

    const statusIcons = {
      verified: <CheckCircle className="h-4 w-4" />,
      compromised: <AlertTriangle className="h-4 w-4" />,
      unknown: <Clock className="h-4 w-4" />,
      incomplete: <AlertTriangle className="h-4 w-4" />
    };

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[integrity.status]}`}>
        {statusIcons[integrity.status]}
        <span className="capitalize">{integrity.status}</span>
      </div>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading chain of custody...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Chain of Custody</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={loadCustodyChain}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Chain of Custody</h2>
              <p className="text-gray-600 mt-1">
                Evidence: {evidenceInfo?.filename} (ID: {evidenceInfo?.evidence_id})
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getIntegrityBadge()}
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
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="border-b border-gray-200 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.total_actions || 0}</div>
                <div className="text-sm text-gray-600">Total Actions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.unique_handlers || 0}</div>
                <div className="text-sm text-gray-600">Unique Handlers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {summary.first_action ? formatDateTime(summary.first_action).split(',')[0] : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">First Action</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {summary.last_action ? formatDateTime(summary.last_action).split(',')[0] : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Last Action</div>
              </div>
            </div>

            {/* Action Summary */}
            {summary.actions_summary && Object.keys(summary.actions_summary).length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Action Summary</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(summary.actions_summary).map(([action, count]) => (
                    <span key={action} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {getActionIcon(action)}
                      <span className="capitalize">{action}</span>
                      <span className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chain of Custody Timeline */}
        <div className="p-6 overflow-y-auto max-h-96">
          {custodyChain.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Custody Records</h3>
              <p className="text-gray-600">No chain of custody records found for this evidence.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {custodyChain.map((record, index) => (
                <div key={record.id} className="relative">
                  {/* Timeline line */}
                  {index !== custodyChain.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                  )}
                  
                  <div className="flex gap-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                      {getActionIcon(record.action)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {record.action.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600">{record.action_description}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(record.action_timestamp)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Performed by:</span>
                          <span className="font-medium">{record.performed_by || 'Unknown'}</span>
                        </div>
                        
                        {record.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">{record.location}</span>
                          </div>
                        )}
                        
                        {record.transferred_from && record.transferred_to && (
                          <div className="md:col-span-2 flex items-center gap-2">
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Transfer:</span>
                            <span className="font-medium">{record.transferred_from}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{record.transferred_to}</span>
                          </div>
                        )}
                        
                        {record.tool_used && (
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Tool:</span>
                            <span className="font-medium">{record.tool_used}</span>
                            {record.tool_version && (
                              <span className="text-gray-500">v{record.tool_version}</span>
                            )}
                          </div>
                        )}
                        
                        {record.hash_verified !== null && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className={`h-4 w-4 ${record.hash_verified ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="text-gray-600">Hash:</span>
                            <span className={`font-medium ${record.hash_verified ? 'text-green-600' : 'text-red-600'}`}>
                              {record.hash_verified ? 'Verified' : 'Failed'}
                            </span>
                          </div>
                        )}
                        
                        {record.ip_address && (
                          <div className="text-xs text-gray-500 md:col-span-2">
                            IP: {record.ip_address}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {integrity && (
                <span>Integrity Status: <strong className="capitalize">{integrity.status}</strong></span>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChainOfCustody;
