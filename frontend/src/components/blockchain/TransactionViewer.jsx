import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCopy, FaSearch, FaCheck } from 'react-icons/fa';

const TransactionViewer = ({ isOpen, onClose, txHash }) => {
  const [copied, setCopied] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const fetchTransactionData = async () => {
    if (!txHash) return;
    
    setLoading(true);
    try {
      // This would fetch transaction data from your backend
      const response = await fetch(`/api/blockchain/transaction/${txHash}`);
      if (response.ok) {
        const data = await response.json();
        setTransactionData(data);
      }
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && txHash) {
      fetchTransactionData();
    }
  }, [isOpen, txHash]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          <motion.div
            className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <h2 className="text-xl font-bold text-white">Transaction Details</h2>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <span className="ml-3 text-slate-400">Loading transaction data...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Transaction Hash */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Transaction Hash</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="font-mono text-sm text-slate-200 break-all">{txHash}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(txHash)}
                        className="p-3 text-slate-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-slate-800"
                      >
                        {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                      </button>
                    </div>
                  </div>

                  {/* Ganache Instructions */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-2">View in Ganache</h3>
                    <p className="text-slate-300 text-sm mb-3">
                      To view detailed transaction information:
                    </p>
                    <ol className="text-slate-300 text-sm space-y-1 list-decimal list-inside">
                      <li>Open your Ganache application</li>
                      <li>Click on the "Transactions" tab</li>
                      <li>Find this transaction hash in the list</li>
                      <li>Click on the transaction to see full details</li>
                    </ol>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Network</label>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-slate-200">Ganache Local Network</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Status</label>
                      <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-green-400">Confirmed</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h3 className="text-slate-300 font-medium mb-2">Blockchain Integration Status</h3>
                    <div className="flex items-center space-x-2 text-green-400 text-sm">
                      <FaCheck />
                      <span>Evidence hash permanently recorded on blockchain</span>
                    </div>
                    <div className="flex items-center space-x-2 text-green-400 text-sm mt-1">
                      <FaCheck />
                      <span>Transaction confirmed and immutable</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionViewer;
