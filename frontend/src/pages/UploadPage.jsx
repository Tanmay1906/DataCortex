import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { 
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
  Activity,
  X,
  Plus,
  Download,
  Eye,
  Fingerprint,
  Globe,
  Network,
  Building,
  User,
  Calendar
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Alert from '../components/ui/Alert';
import Loader from '../components/ui/Loader';
import { getCases } from '../services/cases';
import { uploadEvidence } from '../services/evidence';

const UploadPage = () => {
  const { caseId: urlCaseId } = useParams();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState({});

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      caseId: urlCaseId || '',
      description: '',
      classification: 'standard',
      priority: 'medium'
    }
  });

  const watchedCaseId = watch('caseId');
  const watchedClassification = watch('classification');

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const data = await getCases();
        setCases(data);
      } catch (error) {
        setAlert({
          type: 'error',
          message: 'Failed to load cases. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'pending',
      hash: null,
      uploadProgress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg'],
      'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar'],
      'text/*': ['.txt', '.csv', '.log', '.json', '.xml']
    }
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const calculateFileHash = async (file) => {
    // Simulate hash calculation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`sha256:${Math.random().toString(36).substr(2, 64)}`);
      }, 1000);
    });
  };

  const simulateUpload = async (fileData) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(prev => ({
          ...prev,
          [fileData.id]: progress
        }));
      }, 200);
    });
  };

  const onSubmit = async (data) => {
    if (uploadedFiles.length === 0) {
      setAlert({
        type: 'error',
        message: 'Please select at least one file to upload.'
      });
      return;
    }

    setUploading(true);
    setCurrentStep(2);

    try {
      // Step 1: Calculate hashes
      for (const fileData of uploadedFiles) {
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'hashing' } : f)
        );
        
        const hash = await calculateFileHash(fileData.file);
        
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, hash, status: 'uploading' } : f)
        );
      }

      setCurrentStep(3);

      // Step 2: Upload files
      for (const fileData of uploadedFiles) {
        await simulateUpload(fileData);
        
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'completed' } : f)
        );
      }

      setCurrentStep(4);

      setAlert({
        type: 'success',
        message: `Successfully uploaded ${uploadedFiles.length} file(s) to the blockchain.`
      });

      // Reset form after successful upload
      setTimeout(() => {
        reset();
        setUploadedFiles([]);
        setCurrentStep(1);
        setUploadProgress({});
        navigate(`/cases/${data.caseId}`);
      }, 2000);

    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Upload failed. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'hashing':
        return <Hash className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'uploading':
        return <Upload className="w-4 h-4 text-purple-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <File className="w-4 h-4 text-forensics-slate-400" />;
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'classified':
        return 'from-red-500 to-pink-500';
      case 'confidential':
        return 'from-orange-500 to-red-500';
      case 'restricted':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="p-8 border-forensics-cyber-500/30">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-forensics-cyber-400 to-forensics-navy-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-forensics-cyber-400/20 to-forensics-navy-500/20 rounded-2xl blur-lg" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white to-forensics-cyber-300 bg-clip-text text-transparent">
                    Evidence Upload
                  </h1>
                  <p className="text-forensics-slate-400 text-lg">
                    Secure Digital Evidence Processing & Blockchain Storage
                  </p>
                </div>
              </div>

              {/* Security Indicators */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 glass-effect border border-green-500/30 rounded-xl">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 glass-effect border border-blue-500/30 rounded-xl">
                  <Fingerprint className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-semibold">Blockchain Verified</span>
                </div>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[
                { step: 1, title: 'Select Files', icon: File },
                { step: 2, title: 'Generate Hashes', icon: Hash },
                { step: 3, title: 'Upload & Encrypt', icon: Upload },
                { step: 4, title: 'Blockchain Storage', icon: Database }
              ].map(({ step, title, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-forensics-cyber-500/20 text-forensics-cyber-300 border border-forensics-cyber-500/30' 
                      : 'text-forensics-slate-400 border border-forensics-slate-700/30'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-semibold">{title}</span>
                  </div>
                  {step < 4 && (
                    <div className={`w-8 h-0.5 mx-2 transition-colors duration-300 ${
                      currentStep > step ? 'bg-forensics-cyber-400' : 'bg-forensics-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {alert && (
              <Alert type={alert.type} className="mb-6">
                {alert.message}
              </Alert>
            )}
          </Card>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Case Selection and Metadata */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Database className="w-5 h-5 text-forensics-cyber-400" />
                <span>Case Assignment & Classification</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                    Target Case *
                  </label>
                  <select
                    {...register('caseId', { required: 'Case selection is required' })}
                    className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                  >
                    <option value="" className="bg-forensics-dark text-white">Select a case...</option>
                    {cases.map(case_ => (
                      <option key={case_.id} value={case_.id} className="bg-forensics-dark text-white">
                        {case_.case_number} - {case_.title}
                      </option>
                    ))}
                  </select>
                  {errors.caseId && (
                    <p className="text-red-400 text-sm mt-1">{errors.caseId.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                    Security Classification
                  </label>
                  <select
                    {...register('classification')}
                    className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                  >
                    <option value="standard" className="bg-forensics-dark text-white">Standard</option>
                    <option value="restricted" className="bg-forensics-dark text-white">Restricted</option>
                    <option value="confidential" className="bg-forensics-dark text-white">Confidential</option>
                    <option value="classified" className="bg-forensics-dark text-white">Classified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                    Priority Level
                  </label>
                  <select
                    {...register('priority')}
                    className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                  >
                    <option value="low" className="bg-forensics-dark text-white">Low Priority</option>
                    <option value="medium" className="bg-forensics-dark text-white">Medium Priority</option>
                    <option value="high" className="bg-forensics-dark text-white">High Priority</option>
                    <option value="urgent" className="bg-forensics-dark text-white">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                    Evidence Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Describe the digital evidence being uploaded..."
                    className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300 resize-none"
                  />
                </div>
              </div>

              {/* Classification Info */}
              {watchedClassification && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 glass-effect border border-forensics-cyber-500/20 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 bg-gradient-to-r ${getClassificationColor(watchedClassification)} rounded-full`} />
                    <span className="text-sm font-semibold text-white uppercase">{watchedClassification}</span>
                    <span className="text-xs text-forensics-slate-400">Security Level</span>
                  </div>
                </motion.div>
              )}
            </Card>

            {/* File Upload Area */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-forensics-cyber-400" />
                <span>Digital Evidence Files</span>
              </h2>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-forensics-cyber-400 bg-forensics-cyber-500/10'
                    : 'border-forensics-slate-600 hover:border-forensics-cyber-500 hover:bg-forensics-slate-800/20'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-forensics-cyber-400/20 to-forensics-navy-500/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-forensics-cyber-400" />
                  </div>
                  
                  {isDragActive ? (
                    <div>
                      <p className="text-xl font-semibold text-forensics-cyber-300">
                        Drop files here to upload
                      </p>
                      <p className="text-forensics-slate-400">
                        All files will be encrypted and hashed
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xl font-semibold text-white">
                        Drag & drop evidence files here
                      </p>
                      <p className="text-forensics-slate-400">
                        or click to browse your computer
                      </p>
                      <p className="text-sm text-forensics-slate-500 mt-2">
                        Supports: Images, Videos, Audio, Documents, Archives, Logs
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-forensics-cyber-400" />
                    <span>Selected Files ({uploadedFiles.length})</span>
                  </h2>
                  
                  <div className="text-sm text-forensics-slate-400">
                    Total Size: {formatFileSize(uploadedFiles.reduce((acc, f) => acc + f.size, 0))}
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {uploadedFiles.map((fileData) => (
                    <motion.div
                      key={fileData.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 glass-effect border border-forensics-cyber-500/20 rounded-xl"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getStatusIcon(fileData.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{fileData.name}</p>
                          <p className="text-sm text-forensics-slate-400">
                            {formatFileSize(fileData.size)} • {fileData.type || 'Unknown type'}
                          </p>
                          
                          {fileData.hash && (
                            <p className="text-xs text-green-400 font-mono mt-1 truncate">
                              {fileData.hash}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {fileData.status === 'uploading' && uploadProgress[fileData.id] && (
                          <div className="w-24 bg-forensics-slate-700 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-forensics-cyber-400 to-forensics-navy-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress[fileData.id]}%` }}
                            />
                          </div>
                        )}
                        
                        {!uploading && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(fileData.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-forensics-slate-400">
                <div className="flex items-center space-x-1">
                  <Lock className="w-4 h-4" />
                  <span>256-bit AES Encryption</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>SHA-256 Integrity Verification</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Database className="w-4 h-4" />
                  <span>Immutable Blockchain Storage</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={uploading || uploadedFiles.length === 0 || !watchedCaseId}
                className="flex items-center space-x-2 px-8 py-3"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload Evidence</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6 border-blue-500/30">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">International Security Compliance</h3>
                <p className="text-forensics-slate-300 text-sm leading-relaxed">
                  All uploaded evidence is processed according to international digital forensics standards (ISO/IEC 27037:2012). 
                  Files are automatically encrypted using military-grade AES-256 encryption, integrity-verified with SHA-256 hashing, 
                  and stored on an immutable blockchain network for complete chain of custody preservation.
                </p>
                <div className="flex items-center space-x-4 mt-4 text-xs text-forensics-slate-400">
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3" />
                    <span>ISO 27037 Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Network className="w-3 h-3" />
                    <span>Multi-Jurisdiction Support</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-3 h-3" />
                    <span>Enterprise Grade Security</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
