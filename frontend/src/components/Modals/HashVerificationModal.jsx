import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaCheck, FaTimes, FaCopy, FaFileUpload } from 'react-icons/fa';
import Button from '../ui/Button';

const HashVerificationModal = ({ isOpen, onClose }) => {
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'file'
  const [inputText, setInputText] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256');
  const [calculatedHash, setCalculatedHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState('');

  const hashAlgorithms = [
    { value: 'sha256', label: 'SHA-256' },
    { value: 'sha1', label: 'SHA-1' },
    { value: 'md5', label: 'MD5' }
  ];

  const calculateHash = async (input, algorithm) => {
    try {
      const encoder = new TextEncoder();
      const data = typeof input === 'string' ? encoder.encode(input) : input;
      
      let hashBuffer;
      switch (algorithm) {
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'md5':
          // MD5 is not natively supported, we'll use a simple simulation
          // In a real implementation, you'd use a crypto library
          setError('MD5 is not supported in this browser implementation');
          return null;
        default:
          throw new Error('Unsupported algorithm');
      }
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      console.error('Hash calculation error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const hash = await calculateHash(arrayBuffer, hashAlgorithm);
      setCalculatedHash(hash);
      setInputText(`File: ${file.name} (${file.size} bytes)`);
    } catch (error) {
      setError('Failed to calculate file hash');
    }
  };

  const handleTextVerification = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to hash');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const hash = await calculateHash(inputText, hashAlgorithm);
      setCalculatedHash(hash);
      
      if (expectedHash.trim()) {
        const matches = hash.toLowerCase() === expectedHash.toLowerCase().trim();
        setVerificationResult(matches);
      }
    } catch (error) {
      setError('Failed to calculate hash');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyHash = () => {
    if (!calculatedHash || !expectedHash.trim()) {
      setError('Please provide both calculated and expected hashes');
      return;
    }

    const matches = calculatedHash.toLowerCase() === expectedHash.toLowerCase().trim();
    setVerificationResult(matches);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setInputText('');
    setExpectedHash('');
    setCalculatedHash('');
    setVerificationResult(null);
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <motion.div
              className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 border border-slate-600/50 rounded-2xl p-6 backdrop-blur-lg shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <FaShieldAlt className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Hash Verification Tool</h2>
                    <p className="text-sm text-slate-400">Verify file integrity and data authenticity</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Input Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Input Method
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setInputMethod('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputMethod === 'text'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Text Input
                  </button>
                  <button
                    onClick={() => setInputMethod('file')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      inputMethod === 'file'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    File Upload
                  </button>
                </div>
              </div>

              {/* Hash Algorithm Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hash Algorithm
                </label>
                <select
                  value={hashAlgorithm}
                  onChange={(e) => setHashAlgorithm(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  {hashAlgorithms.map(algo => (
                    <option key={algo.value} value={algo.value}>
                      {algo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input Section */}
              <div className="mb-6">
                {inputMethod === 'text' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Text to Hash
                    </label>
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Enter text to calculate hash..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                    <Button
                      onClick={handleTextVerification}
                      loading={isVerifying}
                      className="mt-3"
                      variant="secondary"
                    >
                      Calculate Hash
                    </Button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload File
                    </label>
                    <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center">
                      <FaFileUpload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium"
                      >
                        Click to upload file
                      </label>
                      <p className="text-slate-400 text-sm mt-1">or drag and drop</p>
                      {inputText && (
                        <p className="text-slate-300 text-sm mt-2 font-mono">{inputText}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Calculated Hash */}
              {calculatedHash && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Calculated Hash ({hashAlgorithm.toUpperCase()})
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      value={calculatedHash}
                      readOnly
                      className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white font-mono text-sm"
                    />
                    <Button
                      onClick={() => copyToClipboard(calculatedHash)}
                      variant="outline"
                      size="sm"
                    >
                      <FaCopy />
                    </Button>
                  </div>
                </div>
              )}

              {/* Expected Hash for Verification */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Expected Hash (for verification)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    value={expectedHash}
                    onChange={(e) => setExpectedHash(e.target.value)}
                    placeholder="Enter expected hash to verify..."
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <Button
                    onClick={handleVerifyHash}
                    variant="primary"
                    disabled={!calculatedHash || !expectedHash.trim()}
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {/* Verification Result */}
              {verificationResult !== null && (
                <div className={`p-4 rounded-xl border ${
                  verificationResult 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  <div className="flex items-center">
                    {verificationResult ? (
                      <FaCheck className="w-5 h-5 mr-3" />
                    ) : (
                      <FaTimes className="w-5 h-5 mr-3" />
                    )}
                    <div>
                      <p className="font-semibold">
                        {verificationResult ? 'Hash Verification Successful' : 'Hash Verification Failed'}
                      </p>
                      <p className="text-sm opacity-80">
                        {verificationResult 
                          ? 'The calculated hash matches the expected hash. Data integrity verified.'
                          : 'The calculated hash does not match the expected hash. Data may be corrupted or modified.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={resetForm}
                  variant="ghost"
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={onClose}
                  variant="primary"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HashVerificationModal;
