import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import EvidenceList from '../components/evidence/EvidenceList';
import { motion } from 'framer-motion';
import { getCases } from '../services/cases';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { 
  Shield, 
  Search, 
  Upload, 
  Database, 
  Lock, 
  Clock, 
  FileText, 
  Plus,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';

const EvidencePage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!caseId) {
      const fetchCases = async () => {
        try {
          setLoading(true);
          const data = await getCases();
          setCases(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCases();
    }
  }, [caseId]);

  const handleCaseSelection = () => {
    if (selectedCaseId) {
      navigate(`/evidence/${selectedCaseId}`);
    }
  };

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
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center space-x-3">
              <Database className="w-8 h-8 text-forensics-cyber-400" />
              <span>Evidence Repository</span>
            </h1>
            <p className="text-forensics-slate-300 text-lg">
              Secure digital evidence management with blockchain verification
            </p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-forensics-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Integrity Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Blockchain Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>Encrypted Storage</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/upload-evidence">
              <motion.button
                className="btn-cyber px-6 py-3 rounded-xl font-semibold tracking-wide flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload className="w-5 h-5" />
                <span>Upload Evidence</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-12 text-center"
        >
          <Loader />
          <p className="text-forensics-slate-300 mt-4">Loading evidence repository...</p>
        </motion.div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-red-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-bold text-red-400">Error Loading Cases</h3>
          </div>
          <p className="text-red-300">{error}</p>
        </motion.div>
      ) : !caseId ? (
        <div className="space-y-8">
          {/* Case Selection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-6"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-3">
                <FileText className="w-6 h-6 text-forensics-cyber-400" />
                <span>Select Investigation Case</span>
              </h2>
              <p className="text-forensics-slate-300">
                Choose a case to view and manage its digital evidence
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="flex-1 glass-effect border border-forensics-cyber-500/30 text-white rounded-xl px-4 py-3 focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
              >
                <option value="" className="bg-forensics-navy-900">Select a case...</option>
                {cases.map((case_item) => (
                  <option key={case_item.id} value={case_item.id} className="bg-forensics-navy-900">
                    {case_item.case_number || `Case #${case_item.id}`} - {case_item.title}
                  </option>
                ))}
              </select>
              
              <motion.button
                onClick={handleCaseSelection}
                disabled={!selectedCaseId}
                className="btn-cyber px-6 py-3 rounded-xl font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: selectedCaseId ? 1.05 : 1 }}
                whileTap={{ scale: selectedCaseId ? 0.95 : 1 }}
              >
                View Evidence
              </motion.button>
            </div>

            {cases.length === 0 && !loading && (
              <div className="text-center py-12 mt-6 glass-effect border border-forensics-slate-600/30 rounded-xl">
                <FileText className="w-12 h-12 text-forensics-slate-400 mx-auto mb-4" />
                <p className="text-forensics-slate-400 text-lg">No cases found. Please create a case first.</p>
              </div>
            )}
          </motion.div>

          {/* Evidence Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Upload Feature */}
            <div className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-6 hover:border-forensics-cyber-400/40 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-forensics-cyber-500/20 to-forensics-navy-600/20 rounded-xl">
                  <Upload className="w-6 h-6 text-forensics-cyber-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Secure Upload</h3>
              </div>
              <p className="text-forensics-slate-300 mb-4">
                Upload digital evidence files with automatic hash calculation and blockchain verification for tamper-proof storage.
              </p>
              <div className="flex items-center space-x-2 text-sm text-forensics-cyber-400">
                <CheckCircle className="w-4 h-4" />
                <span>SHA256 Hashing</span>
              </div>
            </div>

            {/* Security Feature */}
            <div className="glass-card border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-xl">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Chain of Custody</h3>
              </div>
              <p className="text-forensics-slate-300 mb-4">
                Immutable blockchain records ensure evidence integrity with timestamped access logs and verification trails.
              </p>
              <div className="flex items-center space-x-2 text-sm text-emerald-400">
                <Lock className="w-4 h-4" />
                <span>Blockchain Secured</span>
              </div>
            </div>

            {/* Analytics Feature */}
            <div className="glass-card border border-orange-500/20 rounded-2xl p-6 hover:border-orange-400/40 transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-xl">
                  <Activity className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Audit Trail</h3>
              </div>
              <p className="text-forensics-slate-300 mb-4">
                Complete audit trail with timestamped evidence logs, access tracking, and forensic metadata analysis.
              </p>
              <div className="flex items-center space-x-2 text-sm text-orange-400">
                <Clock className="w-4 h-4" />
                <span>Real-time Monitoring</span>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        /* Evidence List for specific case */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-6"
        >
          <EvidenceList caseId={caseId} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default EvidencePage;
