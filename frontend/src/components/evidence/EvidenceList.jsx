import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEvidenceByCase } from '../../services/evidence';
import EvidenceCard from './EvidenceCard';
import Loader from '../ui/Loader';
import EvidenceDropzone from './EvidenceDropzone';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

const EvidenceList = () => {
  const { caseId } = useParams();
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const data = await getEvidenceByCase(caseId);
        setEvidence(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvidence();
  }, [caseId]);

  const handleUploadSuccess = (newEvidence) => {
    setEvidence((prev) => [newEvidence, ...prev]);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link to="/cases" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
          <FaArrowLeft className="mr-3" />
          <span className="text-lg">Back to Cases</span>
        </Link>
        <div className="flex items-center space-x-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
            Case Evidence
          </h2>
          <Link to={`/upload-evidence/${caseId}`}>
            <Button className="flex items-center space-x-2">
              <FaPlus className="w-4 h-4" />
              <span>Upload Evidence</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-800/90 via-blue-900/90 to-slate-800/90 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl p-8">
        <EvidenceDropzone caseId={caseId} onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="evidence-grid">
        {evidence.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <EvidenceCard evidence={item} />
          </motion.div>
        ))}
      </div>

      {evidence.length === 0 && !loading && (
        <div className="text-center py-16 bg-gradient-to-r from-slate-800/50 via-blue-900/50 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-600/30">
          <p className="text-slate-400 text-xl">No evidence items found for this case</p>
          <p className="text-slate-500 mt-2">Upload your first piece of evidence to get started</p>
        </div>
      )}
    </div>
  );
};

export default EvidenceList;