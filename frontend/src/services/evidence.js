import api from './api';

export const uploadEvidence = async (formData) => {
  try {
    console.log('Uploading evidence with FormData:', formData);
    console.log('Form data entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }
    
    const response = await api.post('/evidence/upload', formData, {
      headers: {
        // Don't manually set Content-Type for FormData - let the browser set it with boundary
        // The api interceptor will add the Authorization header
      },
    });
    
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    throw error;
  }
};

export const getEvidenceByCase = async (caseId) => {
  const response = await api.get(`/evidence/${caseId}`);
  return response.data;
};

export const getEvidence = async () => {
  const response = await api.get('/evidence');
  return response.data;
};

export const downloadEvidence = async (evidenceId) => {
  try {
    console.log('downloadEvidence called with ID:', evidenceId);
    console.log('Making API request to:', `/evidence/file/${evidenceId}`);
    
    const response = await api.get(`/evidence/file/${evidenceId}`, {
      responseType: 'blob',
    });
    
    console.log('downloadEvidence response status:', response.status);
    console.log('downloadEvidence response headers:', response.headers);
    console.log('downloadEvidence response data type:', typeof response.data);
    
    return response.data;
  } catch (error) {
    console.error('downloadEvidence error details:');
    console.error('- Message:', error.message);
    console.error('- Status:', error.response?.status);
    console.error('- Status Text:', error.response?.statusText);
    console.error('- Response Data:', error.response?.data);
    console.error('- Request Headers:', error.config?.headers);
    console.error('- Request URL:', error.config?.url);
    console.error('- Full Error:', error);
    throw error;
  }
};

export const previewEvidence = async (evidenceId) => {
  try {
    console.log('previewEvidence called with ID:', evidenceId);
    console.log('Making API request to:', `/evidence/file/${evidenceId}`);
    
    const response = await api.get(`/evidence/file/${evidenceId}`, {
      responseType: 'blob',
    });
    
    console.log('previewEvidence response status:', response.status);
    console.log('previewEvidence response headers:', response.headers);
    console.log('previewEvidence response data type:', typeof response.data);
    
    return response.data;
  } catch (error) {
    console.error('previewEvidence error details:');
    console.error('- Message:', error.message);
    console.error('- Status:', error.response?.status);
    console.error('- Status Text:', error.response?.statusText);
    console.error('- Response Data:', error.response?.data);
    console.error('- Request Headers:', error.config?.headers);
    console.error('- Request URL:', error.config?.url);
    console.error('- Full Error:', error);
    throw error;
  }
};

export const viewEvidence = async (evidenceId) => {
  const response = await api.get(`/evidence/${evidenceId}/details`);
  return response.data;
};

export const deleteEvidence = async (evidenceId) => {
  const response = await api.delete(`/evidence/${evidenceId}`);
  return response.data;
};