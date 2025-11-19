import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { getCases } from '../services/cases';
import { uploadEvidence } from '../services/evidence';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import Toast from '../components/ui/Toast';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  File, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Clock,
  FileText,
  Hash,
  Activity
} from 'lucide-react';

const UploadEvidencePage = () => {
  const { caseId: urlCaseId } = useParams();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      caseId: urlCaseId || '',
      description: ''
    }
  });

  const watchedCaseId = watch('caseId');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const data = await getCases();
        setCases(data);
        
        // If URL has caseId but it's not in the list, show error
        if (urlCaseId && !data.find(c => c.id.toString() === urlCaseId)) {
          setError(`Case with ID ${urlCaseId} not found`);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [urlCaseId]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setValue('file', file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
      'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'],
      'text/*': ['.txt', '.csv', '.json', '.xml', '.log']
    },
    onDropRejected: (rejectedFiles) => {
      const error = rejectedFiles[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        setToast({ type: 'error', message: 'File is too large. Maximum size is 100MB.' });
      } else {
        setToast({ type: 'error', message: 'File type not supported or invalid file.' });
      }
    }
  });

  const onSubmit = async (data) => {
    if (!selectedFile) {
      setToast({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('case_id', data.caseId);
      formData.append('description', data.description || '');

      const response = await uploadEvidence(formData);
      
      setToast({ 
        type: 'success', 
        message: 'Evidence uploaded successfully and hash recorded on blockchain!' 
      });
      
      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate(urlCaseId ? `/evidence/${urlCaseId}` : '/evidence');
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to upload evidence. Please try again.' 
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-12 text-center">
          <Loader />
          <p className="text-forensics-slate-300 mt-4">Loading upload interface...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative"
    >
      {/* Header Section */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <Link 
            to={urlCaseId ? `/evidence/${urlCaseId}` : '/evidence'} 
            className="inline-flex items-center text-forensics-cyber-400 hover:text-forensics-cyber-300 transition-colors duration-300 group"
          >
            <ArrowLeft className="mr-3 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-lg font-semibold">Back to Evidence Repository</span>
          </Link>
          
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center space-x-3">
              <Upload className="w-8 h-8 text-forensics-cyber-400" />
              <span>Upload Evidence</span>
            </h1>
            <p className="text-forensics-slate-300 text-lg">
              Securely upload digital evidence with blockchain verification
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-forensics-slate-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>SHA256 Hashing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Tamper-Proof Storage</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-red-500/30 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-red-400">Error</h3>
          </div>
          <p className="text-red-300 mt-2">{error}</p>
        </motion.div>
      )}

      {/* Main Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Case Selection */}
          <div>
            <label htmlFor="caseId" className="block text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-forensics-cyber-400" />
              <span>Select Investigation Case *</span>
            </label>
            <select
              id="caseId"
              {...register('caseId', { required: 'Please select a case' })}
              disabled={!!urlCaseId}
              className="w-full glass-effect border border-forensics-cyber-500/30 text-white rounded-xl px-4 py-3 focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300 disabled:opacity-50"
            >
              <option value="" className="bg-forensics-navy-900">Choose a case...</option>
              {cases.map((case_item) => (
                <option key={case_item.id} value={case_item.id} className="bg-forensics-navy-900">
                  {case_item.case_number || `Case #${case_item.id}`} - {case_item.title}
                </option>
              ))}
            </select>
            {errors.caseId && (
              <p className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>{errors.caseId.message}</span>
              </p>
            )}
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <Upload className="w-5 h-5 text-forensics-cyber-400" />
              <span>Upload Evidence File *</span>
            </label>
            
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-forensics-cyber-400 bg-forensics-cyber-500/10'
                  : selectedFile
                  ? 'border-green-400 bg-green-500/10'
                  : 'border-forensics-cyber-500/30 bg-forensics-slate-900/20 hover:border-forensics-cyber-400/50 hover:bg-forensics-cyber-500/5'
              }`}
            >
              <input {...getInputProps()} />
              
              {selectedFile ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">File Selected</h3>
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      <File className="w-5 h-5 text-forensics-cyber-400" />
                      <span className="text-forensics-slate-200 font-semibold">{selectedFile.name}</span>
                    </div>
                    <p className="text-forensics-slate-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Unknown type'}
                    </p>
                    <p className="text-forensics-cyber-400 text-sm mt-2">
                      Click or drag to select a different file
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="p-4 bg-forensics-cyber-500/20 rounded-full">
                      <Upload className="w-8 h-8 text-forensics-cyber-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {isDragActive ? 'Drop the file here' : 'Drop evidence files here'}
                    </h3>
                    <p className="text-forensics-slate-300 mb-4">
                      or click to browse your computer
                    </p>
                    <div className="space-y-2 text-sm text-forensics-slate-400">
                      <p>Supported formats: Images, Videos, Audio, Documents, Text files</p>
                      <p>Maximum file size: 100 MB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-lg font-semibold text-white mb-3 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-forensics-cyber-400" />
              <span>Evidence Description</span>
              <span className="text-sm text-forensics-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              placeholder="Provide a detailed description of this evidence, its relevance to the case, acquisition method, and any important details..."
              className="w-full glass-effect border border-forensics-cyber-500/30 text-white rounded-xl px-4 py-4 focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300 placeholder-forensics-slate-400"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
            <motion.button
              type="button"
              onClick={() => navigate(urlCaseId ? `/evidence/${urlCaseId}` : '/evidence')}
              disabled={uploading}
              className="px-6 py-3 glass-effect border border-forensics-slate-600/30 rounded-xl text-forensics-slate-300 hover:text-white hover:border-forensics-slate-500 transition-all duration-300 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={uploading || !selectedFile || !watchedCaseId}
              className="btn-cyber px-8 py-3 rounded-xl font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
              whileHover={{ scale: uploading || !selectedFile || !watchedCaseId ? 1 : 1.02 }}
              whileTap={{ scale: uploading || !selectedFile || !watchedCaseId ? 1 : 0.98 }}
            >
              {uploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Evidence</span>
                </div>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Security Information Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 glass-card border border-forensics-cyber-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-forensics-cyber-500/20 to-forensics-navy-600/20 rounded-xl">
            <Shield className="w-6 h-6 text-forensics-cyber-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Security & Blockchain Verification</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Hash className="w-5 h-5 text-forensics-cyber-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">SHA256 Hashing</h4>
                <p className="text-forensics-slate-300 text-sm">Files are hashed using SHA256 algorithm for integrity verification</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-emerald-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Blockchain Storage</h4>
                <p className="text-forensics-slate-300 text-sm">File hashes are permanently recorded on the blockchain for tamper-proof verification</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Lock className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Secure Storage</h4>
                <p className="text-forensics-slate-300 text-sm">Original files are encrypted and securely stored on the server infrastructure</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Activity className="w-5 h-5 text-purple-400 mt-1" />
              <div>
                <h4 className="font-semibold text-white">Audit Trail</h4>
                <p className="text-forensics-slate-300 text-sm">All upload activities are logged with timestamps for complete audit tracking</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </motion.div>
  );
};

export default UploadEvidencePage;
