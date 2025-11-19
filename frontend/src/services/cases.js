import api from './api';

export const getCases = async () => {
  // Add cache-busting parameter to ensure fresh data
  const response = await api.get('/cases', {
    params: {
      _t: new Date().getTime() // Cache busting timestamp
    }
  });
  return response.data;
};

export const createCase = async (caseData) => {
  console.log('Creating case with data:', caseData);
  console.log('Status being sent:', caseData.status, '(Type:', typeof caseData.status, ')');
  console.log('Case number being sent:', caseData.caseNumber);
  
  // Don't send caseNumber if it's empty - let the backend generate it
  const payload = { ...caseData };
  if (!payload.caseNumber || payload.caseNumber.trim() === '') {
    delete payload.caseNumber;
  }
  
  const response = await api.post('/cases', payload);
  console.log('Case created, response:', response.data);
  return response.data;
};

export const getCaseById = async (id) => {
  const response = await api.get(`/cases/${id}`);
  return response.data;
};

export const updateCase = async (id, caseData) => {
  const response = await api.put(`/cases/${id}`, caseData);
  return response.data;
};

export const deleteCase = async (id) => {
  console.log('Deleting case with ID:', id);
  const response = await api.delete(`/cases/${id}`);
  console.log('Case deleted, response:', response.data);
  return response.data;
};

export const completeCase = async (id, completionData) => {
  console.log('Completing case with ID:', id, 'Data:', completionData);
  const response = await api.post(`/cases/${id}/complete`, completionData);
  console.log('Case completed, response:', response.data);
  return response.data;
};