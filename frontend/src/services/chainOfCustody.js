import api from './api';

// Get chain of custody for specific evidence
export const getEvidenceCustodyChain = async (evidenceId, caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const response = await api.get(`/evidence/${evidenceId}/custody-chain`, { params });
  return response.data;
};

// Get chain of custody for all evidence in a case
export const getCaseCustodyChain = async (caseId) => {
  const response = await api.get(`/cases/${caseId}/custody-chain`);
  return response.data;
};

// Log a new custody action
export const logCustodyAction = async (evidenceId, actionData) => {
  const response = await api.post(`/evidence/${evidenceId}/custody-action`, actionData);
  return response.data;
};

// Verify evidence integrity
export const verifyEvidenceIntegrity = async (evidenceId, caseId = null) => {
  const params = caseId ? { case_id: caseId } : {};
  const response = await api.get(`/evidence/${evidenceId}/integrity`, { params });
  return response.data;
};

// Get available custody actions
export const getCustodyActions = async () => {
  const response = await api.get('/custody-actions');
  return response.data;
};

// Convenience methods for common custody actions
export const logEvidenceTransfer = async (evidenceId, transferData) => {
  return await logCustodyAction(evidenceId, {
    action: 'transferred',
    ...transferData
  });
};

export const logEvidenceAnalysis = async (evidenceId, analysisData) => {
  return await logCustodyAction(evidenceId, {
    action: 'analyzed',
    ...analysisData
  });
};

export const logHashVerification = async (evidenceId, verificationData) => {
  return await logCustodyAction(evidenceId, {
    action: 'verified',
    ...verificationData
  });
};

export const logEvidenceReview = async (evidenceId, reviewData) => {
  return await logCustodyAction(evidenceId, {
    action: 'reviewed',
    ...reviewData
  });
};
