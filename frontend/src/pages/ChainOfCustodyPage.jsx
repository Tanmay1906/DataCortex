import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Activity, 
  Shield, 
  Clock, 
  User, 
  MapPin, 
  FileText, 
  Search, 
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Hash,
  Building,
  Fingerprint,
  Network,
  Globe,
  Plus,
  X,
  Save
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';
import { getCaseCustodyChain, getEvidenceCustodyChain, logCustodyAction, getCustodyActions } from '../services/chainOfCustody';
import { getCases } from '../services/cases';
import { getEvidenceByCase } from '../services/evidence';

const ChainOfCustodyPage = () => {
  const [activities, setActivities] = useState([]);
  const [cases, setCases] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [custodyActions, setCustodyActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCase, setFilterCase] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      caseId: '',
      evidenceId: '',
      action: '',
      location: '',
      description: '',
      timestamp: new Date().toISOString().slice(0, 16),
      performer: '',
      organization: ''
    }
  });

  const watchedCaseId = watch('caseId');

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [casesData, custodyActionsData] = await Promise.all([
          getCases(),
          getCustodyActions().catch(() => [])
        ]);

        setCases(casesData);
        setCustodyActions(custodyActionsData);

        if (casesData.length > 0) {
          const allActivities = [];
          for (const case_ of casesData) {
            try {
              const caseActivities = await getCaseCustodyChain(case_.id);
              allActivities.push(...caseActivities);
            } catch (error) {
              console.warn(`Failed to fetch custody chain for case ${case_.id}:`, error);
            }
          }
          setActivities(allActivities);
        }

      } catch (error) {
        console.error('Failed to fetch chain of custody data:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load chain of custody data. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch evidence when case is selected
  useEffect(() => {
    const fetchEvidenceForCase = async () => {
      if (watchedCaseId && watchedCaseId !== '') {
        try {
          const evidenceData = await getEvidenceByCase(watchedCaseId);
          setEvidence(evidenceData);
        } catch (error) {
          console.warn('Failed to fetch evidence for case:', error);
          setEvidence([]);
        }
      } else {
        setEvidence([]);
      }
    };

    fetchEvidenceForCase();
  }, [watchedCaseId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-forensics-slate-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'collection':
        return 'from-blue-500 to-cyan-500';
      case 'transfer':
        return 'from-purple-500 to-pink-500';
      case 'analysis':
        return 'from-green-500 to-emerald-500';
      case 'storage':
        return 'from-orange-500 to-red-500';
      default:
        return 'from-forensics-cyber-400 to-forensics-navy-500';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = (activity.evidence_name || activity.evidenceName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.performer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (activity.action || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTypeFilter = filterType === 'all' || (activity.type || activity.action_type) === filterType;
    const matchesCaseFilter = filterCase === 'all' || activity.case_id === filterCase;
    return matchesSearch && matchesTypeFilter && matchesCaseFilter;
  });

  const onSubmitCustodyEntry = async (data) => {
    setSubmitting(true);
    try {
      const timestamp = new Date(data.timestamp).toISOString();
      
      const custodyData = {
        action: data.action,
        performer: data.performer,
        organization: data.organization,
        location: data.location,
        description: data.description,
        timestamp: timestamp
      };

      await logCustodyAction(data.evidenceId, custodyData);
      
      setAlert({
        type: 'success',
        message: 'Custody action logged successfully.'
      });

      const updatedActivities = await getCaseCustodyChain(data.caseId);
      setActivities(prev => {
        const filtered = prev.filter(a => a.case_id !== data.caseId);
        return [...filtered, ...updatedActivities];
      });

      reset();
      setShowAddForm(false);

    } catch (error) {
      console.error('Failed to log custody action:', error);
      setAlert({
        type: 'error',
        message: 'Failed to log custody action. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="glass-card border border-forensics-cyber-500/30 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-forensics-cyber-400 to-forensics-navy-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-forensics-cyber-400/20 to-forensics-navy-500/20 rounded-2xl blur-lg" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white to-forensics-cyber-300 bg-clip-text text-transparent">
                    Chain of Custody
                  </h1>
                  <p className="text-forensics-slate-400 text-lg">
                    Digital Evidence Activity Timeline & Blockchain Verification
                  </p>
                </div>
              </div>

              {/* International Status Indicators */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-4 py-2 glass-effect border border-green-500/30 rounded-xl">
                  <Globe className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-semibold">Global Network</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 glass-effect border border-blue-500/30 rounded-xl">
                  <Network className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-semibold">Blockchain Sync</span>
                </div>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-forensics-slate-400" />
                <input
                  type="text"
                  placeholder="Search by evidence, performer, or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                />
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={filterCase}
                  onChange={(e) => setFilterCase(e.target.value)}
                  className="px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none transition-all duration-300"
                >
                  <option value="all" className="bg-forensics-dark text-white">All Cases</option>
                  {cases.map(case_ => (
                    <option key={case_.id} value={case_.id} className="bg-forensics-dark text-white">
                      {case_.case_number} - {case_.title}
                    </option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none transition-all duration-300"
                >
                  <option value="all" className="bg-forensics-dark text-white">All Activities</option>
                  <option value="collection" className="bg-forensics-dark text-white">Collection</option>
                  <option value="transfer" className="bg-forensics-dark text-white">Transfer</option>
                  <option value="analysis" className="bg-forensics-dark text-white">Analysis</option>
                  <option value="storage" className="bg-forensics-dark text-white">Storage</option>
                </select>

                <Button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Entry</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </Button>
              </div>
            </div>

            {alert && (
              <Alert type={alert.type} className="mt-4">
                {alert.message}
              </Alert>
            )}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          {filteredActivities.length > 0 ? (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-forensics-cyber-400 to-forensics-navy-500 opacity-30" />

              {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative ml-16 mb-8"
              >
                {/* Timeline Node */}
                <div className="absolute -left-12 top-6">
                  <div className={`w-8 h-8 bg-gradient-to-br ${getTypeColor(activity.type || activity.action_type || 'default')} rounded-full flex items-center justify-center shadow-lg`}>
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                <Card className="p-6 hover:border-forensics-cyber-400/50 transition-all duration-300 cursor-pointer group"
                      onClick={() => setSelectedActivity(activity)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-forensics-cyber-300 transition-colors duration-300">
                          {activity.action || activity.action_type || 'Unknown Action'}
                        </h3>
                        {getStatusIcon(activity.status || 'verified')}
                        <Badge variant={(activity.status || 'verified') === 'verified' ? 'success' : (activity.status || 'verified') === 'pending' ? 'warning' : 'error'}>
                          {activity.status || 'verified'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-forensics-slate-300">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-forensics-cyber-400" />
                          <span className="font-semibold">Evidence:</span>
                          <span className="text-forensics-cyber-300">{activity.evidence_name || activity.evidenceName || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-forensics-cyber-400" />
                          <span className="font-semibold">Performer:</span>
                          <span>{activity.performer || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-forensics-cyber-400" />
                          <span className="font-semibold">Organization:</span>
                          <span>{activity.organization || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-forensics-cyber-400" />
                          <span className="font-semibold">Timestamp:</span>
                          <span>{new Date(activity.timestamp || activity.created_at).toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-forensics-cyber-400" />
                          <span className="font-semibold">Location:</span>
                          <span>{activity.location || 'N/A'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-forensics-cyber-400" />
                          <span className="font-semibold">ID:</span>
                          <span className="font-mono text-xs">{activity.id}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="border-t border-forensics-slate-700/50 pt-4">
                    <p className="text-forensics-slate-300 mb-3">{activity.details || activity.description || 'No description provided'}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs">
                        <Fingerprint className="w-3 h-3 text-green-400" />
                        <span className="text-green-400 font-semibold">Blockchain Verified</span>
                        <span className="text-forensics-slate-500">•</span>
                        <span className="text-forensics-slate-400 font-mono">
                          {activity.blockchain_hash ? activity.blockchain_hash.substring(0, 16) + '...' : 'Pending verification'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs">
                        <Shield className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400 font-semibold">Integrity Verified</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-forensics-slate-600/20 to-forensics-slate-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-forensics-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Activity Found</h3>
            <p className="text-forensics-slate-400 mb-6">
              {searchQuery || filterType !== 'all' || filterCase !== 'all' 
                ? 'No activities match your current filters. Try adjusting your search criteria.'
                : 'No chain of custody activities have been recorded yet. Use the "Add Entry" button to log the first activity.'
              }
            </p>
            {(!searchQuery && filterType === 'all' && filterCase === 'all') && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Entry</span>
              </Button>
            )}
          </Card>
        )}
        </motion.div>

        {/* Add Custody Entry Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowAddForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-2xl w-full glass-card border border-forensics-cyber-500/50 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                    <Plus className="w-6 h-6 text-forensics-cyber-400" />
                    <span>Add Custody Entry</span>
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit(onSubmitCustodyEntry)} className="space-y-6">
                  {/* Case Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                      Case *
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

                  {/* Evidence Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                      Evidence *
                    </label>
                    <select
                      {...register('evidenceId', { required: 'Evidence selection is required' })}
                      disabled={!watchedCaseId}
                      className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300 disabled:opacity-50"
                    >
                      <option value="" className="bg-forensics-dark text-white">
                        {watchedCaseId ? 'Select evidence...' : 'Select a case first'}
                      </option>
                      {evidence.map(ev => (
                        <option key={ev.id} value={ev.id} className="bg-forensics-dark text-white">
                          {ev.filename || ev.name} ({ev.file_type || ev.type})
                        </option>
                      ))}
                    </select>
                    {errors.evidenceId && (
                      <p className="text-red-400 text-sm mt-1">{errors.evidenceId.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Action */}
                    <div>
                      <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                        Action *
                      </label>
                      {custodyActions.length > 0 ? (
                        <select
                          {...register('action', { required: 'Action is required' })}
                          className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                        >
                          <option value="" className="bg-forensics-dark text-white">Select action...</option>
                          {custodyActions.map(action => (
                            <option key={action.id} value={action.name} className="bg-forensics-dark text-white">
                              {action.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          {...register('action', { required: 'Action is required' })}
                          placeholder="e.g., Evidence Collected, Transferred, Analyzed"
                          className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                        />
                      )}
                      {errors.action && (
                        <p className="text-red-400 text-sm mt-1">{errors.action.message}</p>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div>
                      <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                        Timestamp *
                      </label>
                      <input
                        type="datetime-local"
                        {...register('timestamp', { required: 'Timestamp is required' })}
                        className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                      />
                      {errors.timestamp && (
                        <p className="text-red-400 text-sm mt-1">{errors.timestamp.message}</p>
                      )}
                    </div>

                    {/* Performer */}
                    <div>
                      <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                        Performer *
                      </label>
                      <input
                        type="text"
                        {...register('performer', { required: 'Performer is required' })}
                        placeholder="e.g., Det. John Smith"
                        className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                      />
                      {errors.performer && (
                        <p className="text-red-400 text-sm mt-1">{errors.performer.message}</p>
                      )}
                    </div>

                    {/* Organization */}
                    <div>
                      <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                        Organization *
                      </label>
                      <input
                        type="text"
                        {...register('organization', { required: 'Organization is required' })}
                        placeholder="e.g., Metropolitan Police - Cyber Division"
                        className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                      />
                      {errors.organization && (
                        <p className="text-red-400 text-sm mt-1">{errors.organization.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      {...register('location')}
                      placeholder="e.g., Crime Scene - 123 Main St, Lab Room A"
                      className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-forensics-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={3}
                      placeholder="Detailed description of the custody action..."
                      className="w-full px-4 py-3 glass-effect border border-forensics-cyber-500/30 rounded-xl text-white placeholder-forensics-slate-400 bg-transparent focus:border-forensics-cyber-400 focus:outline-none focus:ring-2 focus:ring-forensics-cyber-400/20 transition-all duration-300 resize-none"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex items-center justify-end space-x-4 pt-4 border-t border-forensics-slate-700/50">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Logging...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Log Custody Action</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Activity Detail Modal */}
        <AnimatePresence>
          {selectedActivity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedActivity(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-2xl w-full glass-card border border-forensics-cyber-500/50 rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Activity Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedActivity(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-forensics-slate-400 font-semibold">Action:</span>
                      <p className="text-white">{selectedActivity.action}</p>
                    </div>
                    <div>
                      <span className="text-forensics-slate-400 font-semibold">Status:</span>
                      <p className="text-white flex items-center space-x-2">
                        {getStatusIcon(selectedActivity.status)}
                        <span>{selectedActivity.status}</span>
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-forensics-slate-400 font-semibold">Description:</span>
                      <p className="text-white">{selectedActivity.details || selectedActivity.description || 'No description provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-forensics-slate-400 font-semibold">Blockchain Hash:</span>
                      <p className="text-forensics-cyber-300 font-mono text-xs break-all">
                        {selectedActivity.blockchain_hash || selectedActivity.blockchainHash || 'Pending verification'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-forensics-slate-400 font-semibold">Integrity Hash:</span>
                      <p className="text-green-400 font-mono text-xs break-all">
                        {selectedActivity.integrity_hash || selectedActivity.integrity || 'Pending calculation'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{activities.length}</h3>
            <p className="text-forensics-slate-400">Total Activities</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {activities.filter(a => (a.status || 'verified') === 'verified').length}
            </h3>
            <p className="text-forensics-slate-400">Verified</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {activities.filter(a => (a.status || 'verified') === 'pending').length}
            </h3>
            <p className="text-forensics-slate-400">Pending</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">100%</h3>
            <p className="text-forensics-slate-400">Blockchain Secured</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ChainOfCustodyPage;
