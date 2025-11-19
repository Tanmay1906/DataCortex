import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { uploadEvidence } from '../../services/evidence';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

const EvidenceDropzone = ({ caseId, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, setValue, watch } = useForm();

  const watchedFile = watch('file');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length) {
      setValue('file', acceptedFiles[0]);
      setSelectedFile(acceptedFiles[0]);
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('caseId', caseId); // Changed from case_id to caseId to match backend
      formData.append('description', data.description || '');

      const response = await uploadEvidence(formData);
      
      // Reset form
      setValue('file', null);
      setValue('description', '');
      setSelectedFile(null);
      
      onUploadSuccess(response);
      
      setToast({
        type: 'success',
        message: `Evidence uploaded successfully! Blockchain Tx: ${response.txHash || 'N/A'}`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      setToast({
        type: 'error',
        message: error.response?.data?.msg || error.message || 'Failed to upload evidence',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20' 
              : 'border-slate-600 hover:border-cyan-500/50 bg-slate-800/30'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-slate-200 text-lg">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop evidence file here, or click to select'}
          </p>
          <p className="text-slate-400 mt-2">
            Supported formats: PDF, DOCX, TXT, JPG, PNG
          </p>
        </div>

        {selectedFile && (
          <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-600/50">
            <p className="font-semibold text-slate-200 mb-2">Selected file:</p>
            <p className="text-slate-300">
              {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-lg font-semibold text-cyan-300 mb-3">
            Description
          </label>
          <textarea
            id="description"
            {...register('description', { required: true })}
            rows={3}
            className="w-full bg-slate-800/50 border border-slate-600/50 text-slate-200 rounded-xl px-4 py-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 placeholder-slate-500"
            placeholder="Describe this evidence and its relevance to the case..."
          />
        </div>

        <Button type="submit" disabled={isUploading || !selectedFile} size="lg">
          {isUploading ? 'Uploading...' : 'Upload Evidence'}
        </Button>
      </form>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EvidenceDropzone;