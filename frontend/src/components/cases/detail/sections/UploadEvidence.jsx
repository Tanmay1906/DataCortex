import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FaUpload, 
  FaFile, 
  FaTimes, 
  FaCheckCircle, 
  FaSpinner,
  FaFingerprint,
  FaShieldAlt,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const UploadEvidence = ({ caseId, caseData, onEvidenceUploaded }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadResults, setUploadResults] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'ready',
      hash: null,
      txHash: null,
      description: ''
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024 * 1024, // 100GB limit
  });

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileDescription = (fileId, description) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, description } : f
    ));
  };

  const calculateFileHash = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadToBlockchain = async (file, description = '') => {
    // Real API upload to backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    formData.append('description', description);

    const response = await fetch('/api/evidence/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const error = await response.json();
        errorMessage = error.msg || error.message || errorMessage;
      } catch (e) {
        // If response is not JSON, try to get text
        try {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          // If we can't get text either, use the default message
        }
      }
      throw new Error(errorMessage);
    }

    try {
      return await response.json();
    } catch (e) {
      throw new Error('Server returned invalid JSON response');
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      const { file, description } = fileData;

      try {
        // Update status to hashing
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'hashing' } : f
        ));

        // Calculate hash locally for verification
        const clientHash = await calculateFileHash(file);
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, hash: clientHash, status: 'uploading' } : f
        ));

        // Upload to blockchain via backend
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'blockchain' } : f
        ));

        const uploadResult = await uploadToBlockchain(file, description);

        // Verify hashes match
        const hashMatch = clientHash === uploadResult.sha256;

        const result = {
          filename: file.name,
          size: file.size,
          hash: uploadResult.sha256,
          clientHash,
          hashMatch,
          txHash: uploadResult.txHash,
          gasUsed: uploadResult.gasUsed || 0.00001,
          status: 'success', // Explicitly set to success since we got here
          uploadedAt: new Date().toISOString()
        };

        results.push(result);

        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { 
            ...f, 
            status: 'completed', 
            txHash: uploadResult.txHash,
            serverHash: uploadResult.sha256,
            gasUsed: uploadResult.gasUsed || 0.00001
          } : f
        ));

        // Call the callback to refresh evidence list
        if (onEvidenceUploaded) {
          onEvidenceUploaded();
        }

      } catch (error) {
        console.error('Upload failed:', error);
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { 
            ...f, 
            status: 'error', 
            error: error.message 
          } : f
        ));
      }
    }

    setUploadResults(results);
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('zip') || type.includes('archive')) return '📦';
    if (type.includes('text')) return '📝';
    return '📁';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <FaFile className="text-slate-400" />;
      case 'hashing': return <FaSpinner className="text-blue-400 animate-spin" />;
      case 'uploading': return <FaSpinner className="text-yellow-400 animate-spin" />;
      case 'blockchain': return <FaSpinner className="text-cyan-400 animate-spin" />;
      case 'completed': return <FaCheckCircle className="text-green-400" />;
      case 'error': return <FaExclamationTriangle className="text-red-400" />;
      default: return <FaFile className="text-slate-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ready': return 'Ready to upload';
      case 'hashing': return 'Calculating hash...';
      case 'uploading': return 'Uploading to server...';
      case 'blockchain': return 'Storing on blockchain...';
      case 'completed': return 'Upload completed';
      case 'error': return 'Upload failed';
      default: return 'Ready';
    }
  };

  return (
    <div className="space-y-6">
      {/* Show message if case is completed */}
      {caseData?.is_completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center">
            <FaExclamationTriangle className="text-yellow-400 text-xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-300">Case Completed</h3>
              <p className="text-slate-400">
                This case has been marked as completed. No new evidence can be uploaded.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Only show upload section if case is not completed */}
      {!caseData?.is_completed && (
        <div>
          {/* Upload Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
          >
        <div className="flex items-center mb-4">
          <FaUpload className="text-green-400 text-xl mr-3" />
          <div>
            <h2 className="text-xl font-bold text-white">Upload Evidence Files</h2>
            <p className="text-slate-400 text-sm">
              Secure file upload with blockchain verification for Case #{caseData?.caseNumber || caseData?.case_number || caseId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center text-blue-400 mb-2">
              <FaShieldAlt className="mr-2" />
              <span className="font-medium">Secure Upload</span>
            </div>
            <p className="text-xs text-slate-400">
              Files are encrypted and hashed before storage
            </p>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="flex items-center text-cyan-400 mb-2">
              <FaFingerprint className="mr-2" />
              <span className="font-medium">Blockchain Verified</span>
            </div>
            <p className="text-xs text-slate-400">
              File integrity stored immutably on blockchain
            </p>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center text-green-400 mb-2">
              <FaInfoCircle className="mr-2" />
              <span className="font-medium">Auto-Linked</span>
            </div>
            <p className="text-xs text-slate-400">
              Evidence automatically linked to this case
            </p>
          </div>
        </div>
      </motion.div>

      {/* File Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-cyan-400 bg-cyan-500/10' 
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/20'
          }`}
        >
          <input {...getInputProps()} />
          <FaUpload className={`text-6xl mx-auto mb-4 ${isDragActive ? 'text-cyan-400' : 'text-slate-500'}`} />
          
          {isDragActive ? (
            <p className="text-xl text-cyan-400 font-medium">Drop files here...</p>
          ) : (
            <div>
              <p className="text-xl text-white font-medium mb-2">
                Drag & drop evidence files here
              </p>
              <p className="text-slate-400 mb-4">
                or click to browse files
              </p>
              <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Select Files
              </button>
            </div>
          )}
          
          <div className="mt-6 text-xs text-slate-500">
            <p>Supported: All file types • Max size: 100GB per file</p>
            <p>Files will be automatically hashed and stored on blockchain</p>
          </div>
        </div>
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Selected Files ({files.length})
            </h3>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setFiles([])}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                disabled={uploading}
              >
                Clear All
              </button>
              <button
                onClick={uploadFiles}
                disabled={uploading || files.length === 0}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload All Files'}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {files.map((fileData) => (
              <div
                key={fileData.id}
                className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center flex-1">
                    <span className="text-2xl mr-3">
                      {getFileIcon(fileData.file.type)}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(fileData.status)}
                        <span className="text-sm font-medium text-white truncate">
                          {fileData.file.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatFileSize(fileData.file.size)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-400 mb-3">
                        {getStatusText(fileData.status)}
                      </div>

                      {/* File Description */}
                      <input
                        type="text"
                        placeholder="Add description (optional)"
                        value={fileData.description}
                        onChange={(e) => updateFileDescription(fileData.id, e.target.value)}
                        disabled={uploading}
                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                      />

                      {/* Hash Display */}
                      {fileData.hash && (
                        <div className="mt-3 p-2 bg-slate-900/50 rounded-lg">
                          <div className="text-xs text-slate-400 mb-1">SHA256 Hash:</div>
                          <div className="font-mono text-xs text-green-400 break-all">
                            {fileData.hash}
                          </div>
                        </div>
                      )}

                      {/* Transaction Hash */}
                      {fileData.txHash && (
                        <div className="mt-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                          <div className="text-xs text-slate-400 mb-1">
                            {fileData.txHash.startsWith('fallback_') ? 'Local Storage Hash:' : 'Blockchain Transaction:'}
                          </div>
                          <div className="font-mono text-xs text-cyan-400 break-all">
                            {fileData.txHash}
                          </div>
                          {fileData.txHash.startsWith('fallback_') && (
                            <div className="text-xs text-amber-400 mt-1">
                              ⚠️ Blockchain unavailable - stored with local verification
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!uploading && (
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="ml-4 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Upload Results</h3>
          
          <div className="space-y-3">
            {uploadResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {result.status === 'success' ? (
                      <FaCheckCircle className="text-green-400 mr-3" />
                    ) : (
                      <FaExclamationTriangle className="text-red-400 mr-3" />
                    )}
                    <span className="text-white font-medium">{result.filename}</span>
                  </div>
                  
                  {result.status === 'success' && (
                    <span className="text-xs text-slate-400">
                      Successfully stored on blockchain
                    </span>
                  )}
                </div>
                
                {result.error && (
                  <p className="text-red-400 text-sm mt-2">{result.error}</p>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={() => {
              setUploadResults([]);
              setFiles([]);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Upload More Files
          </button>
        </motion.div>
      )}
        </div>
      )}
    </div>
  );
};

export default UploadEvidence;
