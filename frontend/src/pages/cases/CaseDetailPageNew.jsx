import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Database, 
  Upload, 
  Activity, 
  Eye,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  FileText,
  Link as LinkIcon
} from 'lucide-react';
import { getCaseById } from '../../services/cases';
import { getEvidenceByCase } from '../../services/evidence';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../../components/ui/Loader';
import CaseMetadata from '../../components/cases/detail/sections/CaseMetadata';
import EvidenceList from '../../components/cases/detail/sections/EvidenceList';
import BlockchainLog from '../../components/cases/detail/sections/BlockchainLog';
import UploadEvidence from '../../components/cases/detail/sections/UploadEvidence';
import AuditTrail from '../../components/cases/detail/sections/AuditTrail';
import CaseActions from '../../components/cases/detail/CaseActions';

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caseData, setCaseData] = useState(null);
  const [evidenceData, setEvidenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCaseById(id);
        setCaseData(data);
        
        // Also fetch evidence data
        try {
          const evidence = await getEvidenceByCase(id);
          setEvidenceData(evidence || []);
        } catch (evidenceErr) {
          console.error('Error fetching evidence:', evidenceErr);
          setEvidenceData([]); // Set empty array if evidence fetch fails
        }
      } catch (err) {
        console.error('Error fetching case:', err);
        setError(err.message || 'Failed to load case details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCase();
    }
  }, [id]);

  const handleCaseUpdate = (updatedCase) => {
    setCaseData(updatedCase);
  };

  const handleCaseDelete = () => {
    navigate('/cases');
  };

  const refreshData = async () => {
    try {
      const data = await getCaseById(id);
      setCaseData(data);
      
      try {
        const evidence = await getEvidenceByCase(id);
        setEvidenceData(evidence || []);
      } catch (evidenceErr) {
        console.error('Error refreshing evidence:', evidenceErr);
      }
    } catch (err) {
      console.error('Error refreshing case:', err);
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
          <p className="text-forensics-slate-300 mt-4">Loading case details...</p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="glass-card border border-red-500/30 rounded-2xl p-12 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Case</h2>
          <p className="text-red-300 mb-6">{error}</p>
          <Link to="/cases">
            <motion.button
              className="btn-cyber px-6 py-3 rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Cases
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!caseData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="glass-card border border-forensics-slate-500/30 rounded-2xl p-12 text-center max-w-md">
          <FileText className="w-12 h-12 text-forensics-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Case Not Found</h2>
          <p className="text-forensics-slate-300 mb-6">The requested case could not be found.</p>
          <Link to="/cases">
            <motion.button
              className="btn-cyber px-6 py-3 rounded-xl font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Cases
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'evidence', label: 'Evidence', icon: Database },
    { id: 'blockchain', label: 'Blockchain Log', icon: LinkIcon },
    { id: 'upload', label: 'Upload Evidence', icon: Upload },
    { id: 'audit', label: 'Audit Trail', icon: Activity }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'closed':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-forensics-cyber-400 bg-forensics-cyber-500/20 border-forensics-cyber-500/30';
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
          className="flex flex-col gap-6"
        >
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/cases"
              className="inline-flex items-center text-forensics-cyber-400 hover:text-forensics-cyber-300 transition-colors duration-300 group"
            >
              <ArrowLeft className="mr-3 w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-lg font-semibold">Back to Case Management</span>
            </Link>
            
            <CaseActions 
              caseData={caseData}
              evidenceData={evidenceData}
              onUpdate={handleCaseUpdate}
              onDelete={handleCaseDelete}
            />
          </div>

          {/* Case Header */}
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl lg:text-4xl font-black text-white">
                {caseData.title}
              </h1>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(caseData.status)}`}>
                {caseData.status || 'Active'}
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-forensics-slate-300">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-forensics-cyber-400" />
                <span>Case #{caseData.case_number || caseData.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-forensics-cyber-400" />
                <span>Lead: {caseData.investigator || 'Unassigned'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-forensics-cyber-400" />
                <span>Created: {caseData.created_at ? new Date(caseData.created_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
            
            {caseData.description && (
              <p className="text-forensics-slate-300 text-lg mt-4 max-w-4xl">
                {caseData.description}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-forensics-cyber-500/20 border border-forensics-cyber-400/40 text-white'
                      : 'text-forensics-slate-300 hover:text-white hover:bg-forensics-slate-800/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card border border-forensics-cyber-500/20 rounded-2xl p-8"
      >
        {activeTab === 'overview' && (
          <CaseMetadata 
            caseData={caseData} 
            evidenceData={evidenceData}
            onRefresh={refreshData}
          />
        )}
        
        {activeTab === 'evidence' && (
          <EvidenceList 
            evidenceData={evidenceData}
            caseId={id}
            caseData={caseData}
            onRefresh={refreshData}
          />
        )}
        
        {activeTab === 'blockchain' && (
          <BlockchainLog 
            caseId={id}
            evidenceData={evidenceData}
          />
        )}
        
        {activeTab === 'upload' && (
          <UploadEvidence 
            caseId={id}
            onUploadSuccess={refreshData}
          />
        )}
        
        {activeTab === 'audit' && (
          <AuditTrail 
            caseId={id}
            caseData={caseData}
          />
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="glass-card border border-forensics-cyber-500/20 rounded-xl p-6 text-center">
          <Database className="w-8 h-8 text-forensics-cyber-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{evidenceData.length}</div>
          <div className="text-forensics-slate-300 text-sm">Evidence Files</div>
        </div>
        
        <div className="glass-card border border-emerald-500/20 rounded-xl p-6 text-center">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {evidenceData.filter(e => e.verified).length}
          </div>
          <div className="text-forensics-slate-300 text-sm">Verified</div>
        </div>
        
        <div className="glass-card border border-orange-500/20 rounded-xl p-6 text-center">
          <LinkIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">
            {evidenceData.filter(e => e.blockchain_hash).length}
          </div>
          <div className="text-forensics-slate-300 text-sm">Blockchain Secured</div>
        </div>
        
        <div className="glass-card border border-purple-500/20 rounded-xl p-6 text-center">
          <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">24</div>
          <div className="text-forensics-slate-300 text-sm">Audit Events</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CaseDetailPage;
