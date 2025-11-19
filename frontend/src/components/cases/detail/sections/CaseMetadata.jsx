import { motion } from 'framer-motion';
import { 
  FaFolder, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaShieldAlt, 
  FaFingerprint,
  FaUser,
  FaCalendarAlt,
  FaEdit
} from 'react-icons/fa';
import { formatDate, formatRelativeTime } from '../../../../utils/helpers';

const statusIcons = {
  urgent: <FaExclamationTriangle className="text-red-400" />,
  low: <FaClock className="text-green-400" />,
  all: <FaShieldAlt className="text-blue-400" />,
  open: <FaClock className="text-green-400" />,
  closed: <FaCheckCircle className="text-emerald-400" />,
  pending: <FaClock className="text-yellow-400" />,
  active: <FaShieldAlt className="text-blue-400" />,
  completed: <FaCheckCircle className="text-green-400" />,
};

const statusColors = {
  urgent: 'from-red-500/20 to-pink-500/20 border-red-400/30',
  low: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  all: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
  open: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
  closed: 'from-emerald-500/20 to-green-500/20 border-emerald-400/30',
  pending: 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30',
  active: 'from-blue-500/20 to-cyan-500/20 border-blue-400/30',
  completed: 'from-green-500/20 to-emerald-500/20 border-green-400/30',
};

const priorityLevels = {
  urgent: { label: 'Critical', color: 'bg-red-500', textColor: 'text-red-400' },
  high: { label: 'High', color: 'bg-orange-500', textColor: 'text-orange-400' },
  medium: { label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
  low: { label: 'Low', color: 'bg-green-500', textColor: 'text-green-400' },
  all: { label: 'Normal', color: 'bg-blue-500', textColor: 'text-blue-400' },
};

const CaseMetadata = ({ caseData, onUpdate }) => {
  const priority = caseData.priority || caseData.status || 'low';
  const priorityInfo = priorityLevels[priority] || priorityLevels.low;

  return (
    <div className="space-y-8">
      {/* Case Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
      >
        {/* Status Bar */}
        <div className={`h-2 bg-gradient-to-r ${statusColors[caseData.status]}`}></div>
        
        <div className="p-8">
          {/* Case Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 mr-6">
                <FaFolder className="text-blue-400 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{caseData.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="font-mono">Case #{caseData.caseNumber || caseData.id}</span>
                  <div className="h-1 w-1 bg-slate-500 rounded-full"></div>
                  <div className="flex items-center">
                    <FaShieldAlt className="mr-1" />
                    CLASSIFIED
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`flex items-center px-4 py-2 rounded-xl bg-gradient-to-r ${statusColors[caseData.status]} border border-slate-600/30`}>
              <div className="mr-2">
                {statusIcons[caseData.status]}
              </div>
              <span className="text-sm font-semibold capitalize text-white">
                {caseData.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Case Description</h3>
              <button className="text-slate-400 hover:text-white transition-colors">
                <FaEdit className="text-sm" />
              </button>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <p className="text-slate-300 leading-relaxed">
                {caseData.description || 'No description provided for this case.'}
              </p>
            </div>
          </div>

          {/* Case Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Evidence Count */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Evidence Items</span>
                <FaFingerprint className="text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">
                {caseData.evidence_count || caseData.evidenceCount || 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Files uploaded</p>
            </div>
            
            {/* Priority */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Priority Level</span>
                <div className={`h-3 w-3 rounded-full ${priorityInfo.color} animate-pulse`}></div>
              </div>
              <div className={`text-lg font-bold ${priorityInfo.textColor}`}>
                {priorityInfo.label}
              </div>
              <p className="text-xs text-slate-500 mt-1">Investigation priority</p>
            </div>
            
            {/* Created Date */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Created</span>
                <FaCalendarAlt className="text-blue-400" />
              </div>
              <div className="text-sm font-semibold text-white">
                {formatDate(caseData.created_at)}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {formatRelativeTime(caseData.created_at)}
              </p>
            </div>
            
            {/* Last Updated */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Last Updated</span>
                <FaClock className="text-green-400" />
              </div>
              <div className="text-sm font-semibold text-white">
                {formatRelativeTime(caseData.updated_at)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Most recent activity</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Case Completion Information - only show if case is completed */}
      {caseData.is_completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="backdrop-blur-xl bg-green-500/5 border border-green-400/20 rounded-2xl p-6"
        >
          <div className="flex items-center mb-4">
            <FaCheckCircle className="text-green-400 text-xl mr-3" />
            <h3 className="text-lg font-semibold text-white">Case Completion Information</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                <span className="text-slate-400">Completed By</span>
                <span className="text-white font-medium">{caseData.completed_by_name}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                <span className="text-slate-400">Position/Title</span>
                <span className="text-white font-medium">{caseData.completed_by_position}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                <span className="text-slate-400">Authorization</span>
                <span className="text-white font-medium font-mono">{caseData.completion_authorization}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-green-400/20">
                <span className="text-slate-400">Completion Date</span>
                <span className="text-white font-medium">
                  {formatDate(caseData.completed_at)}
                </span>
              </div>
              
              {caseData.completion_notes && (
                <div className="bg-slate-800/30 rounded-lg p-3">
                  <span className="text-slate-400 text-sm block mb-2">Completion Notes:</span>
                  <p className="text-white text-sm leading-relaxed">{caseData.completion_notes}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Additional Case Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Investigation Details */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-400" />
            Investigation Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Lead Investigator</span>
              <span className="text-white font-medium">
                {caseData.leadInvestigator || caseData.lead_investigator || 'Unassigned'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Evidence Type</span>
              <span className="text-white font-medium">
                {caseData.evidenceType || caseData.evidence_type || 'Digital'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Case Number</span>
              <span className="text-white font-medium font-mono">
                {caseData.caseNumber || `TRM-${caseData.id}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Created By</span>
              <span className="text-white font-medium">
                User #{caseData.uploaded_by}
              </span>
            </div>
          </div>
        </div>

        {/* Case Statistics */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FaFingerprint className="mr-2 text-cyan-400" />
            Case Statistics
          </h3>
          
          <div className="space-y-4">
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Evidence</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {caseData.evidence_count || 0}
                </span>
              </div>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Blockchain Entries</span>
                <span className="text-green-400 font-bold text-lg">0</span>
              </div>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Days Active</span>
                <span className="text-blue-400 font-bold text-lg">
                  {Math.ceil((new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"})) - new Date(caseData.created_at)) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            </div>
            
            <div className="bg-slate-800/30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Last Activity</span>
                <span className="text-yellow-400 font-bold text-sm">
                  {formatRelativeTime(caseData.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseMetadata;
