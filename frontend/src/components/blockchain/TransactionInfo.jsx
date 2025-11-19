import { useEffect, useState } from 'react';
import { FaEthereum, FaCheckCircle, FaClock } from 'react-icons/fa';
import TransactionViewer from './TransactionViewer';

const TransactionInfo = ({ txHash, network = 'ganache' }) => {
  const [confirmations, setConfirmations] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Simulate confirmation updates (in a real app, this would come from Web3 or backend)
  useEffect(() => {
    if (!txHash) return;

    const interval = setInterval(() => {
      setConfirmations((prev) => {
        const newConfirmations = prev + 1;
        if (newConfirmations >= 12) {
          setIsConfirmed(true);
          clearInterval(interval);
        }
        return newConfirmations;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [txHash]);

  if (!txHash) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-2 mb-2">
        <FaEthereum className="text-purple-600" />
        <span className="font-medium">Blockchain Transaction</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {isConfirmed ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaClock className="text-yellow-500" />
          )}
          <span className="text-sm font-mono break-all">{txHash}</span>
        </div>
        <TransactionViewer txHash={txHash} />
      </div>

      {!isConfirmed && (
        <div className="text-xs text-gray-500">
          Confirmations: {confirmations}/12
        </div>
      )}

      {isConfirmed && (
        <div className="text-xs text-green-500 font-medium">
          Transaction confirmed
        </div>
      )}
    </div>
  );
};

export default TransactionInfo;