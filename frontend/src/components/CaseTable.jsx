import React from 'react';
import { Shield, Clock, FileText, AlertTriangle, CheckCircle, Pause, Database, Search, Eye, MoreHorizontal } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

const CaseTable = ({ cases }) => {

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        bg: 'bg-gradient-to-r from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-400/30',
        text: 'text-emerald-400',
        icon: CheckCircle,
        glow: 'shadow-emerald-500/20'
      },
      pending: {
        bg: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
        border: 'border-amber-400/30',
        text: 'text-amber-400',
        icon: Clock,
        glow: 'shadow-amber-500/20'
      },
      completed: {
        bg: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-400/30',
        text: 'text-blue-400',
        icon: CheckCircle,
        glow: 'shadow-blue-500/20'
      }
    }
    return configs[status] || configs.pending;
  };

  return (
    <div className="relative">
      {/* Enhanced Table Container - Removed outer background to fit in dashboard */}
      <div className="overflow-hidden">
        {/* Animated Top Border */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 animate-pulse"></div>
        
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full divide-y divide-slate-700/50" style={{ minWidth: '800px' }}>
              <thead className="bg-gradient-to-r from-slate-800/30 to-slate-900/30">
                <tr>
                  <th className="px-3 sm:px-6 py-4 text-left w-1/6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                      </div>
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden sm:inline">
                        Case ID
                      </span>
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent sm:hidden">
                        ID
                      </span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left w-2/6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                      </div>
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Investigation
                      </span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left w-1/6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                      </div>
                      <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        Status
                      </span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left w-1/6 hidden md:table-cell">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      </div>
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Last Activity
                      </span>
                    </div>
                  </th>
                  <th className="px-3 sm:px-6 py-4 text-left w-1/6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                        <Database className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400" />
                      </div>
                      <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent hidden sm:inline">
                        Evidence
                      </span>
                      <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent sm:hidden">
                        Items
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {Array.isArray(cases) ? cases.map((caseItem, index) => {
                  const statusConfig = getStatusConfig(caseItem.status);
                  const StatusIcon = statusConfig.icon;
                  const formattedDateTime = formatDateTime(caseItem.updated_at);
                  
                  return (
                    <tr 
                      key={caseItem.id} 
                      className="group hover:bg-gradient-to-r hover:from-blue-500/5 hover:via-purple-500/5 hover:to-indigo-500/5 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-blue-400/50"
                    >
                      {/* Case ID with Enhanced Styling */}
                      <td className="px-3 sm:px-6 py-4 sm:py-6 relative">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-1 sm:w-2 h-8 sm:h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"></div>
                          <div>
                            <div className="text-xs sm:text-sm font-mono font-bold text-blue-400 group-hover:text-blue-300 transition-colors truncate max-w-20 sm:max-w-none">
                              {caseItem.id}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 hidden sm:block">
                              #{String(index + 1).padStart(3, '0')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Investigation Title */}
                      <td className="px-3 sm:px-6 py-4 sm:py-6">
                        <div className="max-w-xs">
                          <div className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white transition-colors leading-4 sm:leading-5 truncate">
                            {caseItem.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-1 truncate hidden sm:block">
                            Digital Forensic Investigation
                          </div>
                        </div>
                      </td>

                      {/* Enhanced Status Badge */}
                      <td className="px-3 sm:px-6 py-4 sm:py-6">
                        <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border backdrop-blur-sm ${statusConfig.bg} ${statusConfig.border} ${statusConfig.glow} shadow-lg transition-all duration-300 group-hover:scale-105`}>
                          <StatusIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${statusConfig.text}`} />
                          <span className={`text-xs sm:text-sm font-bold ${statusConfig.text} capitalize tracking-wide hidden sm:inline`}>
                            {caseItem.status}
                          </span>
                        </div>
                      </td>

                      {/* Enhanced Time Display - Hidden on mobile */}
                      <td className="px-3 sm:px-6 py-4 sm:py-6 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-slate-300">
                            {formattedDateTime}
                          </div>
                        </div>
                      </td>

                      {/* Evidence Count with Visual Enhancement */}
                      <td className="px-3 sm:px-6 py-4 sm:py-6">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg sm:rounded-xl flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-400/50 transition-colors">
                            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                          </div>
                          <div className="hidden sm:block">
                            <div className="text-lg font-bold text-indigo-400">
                              {caseItem.evidence_count || 0}
                            </div>
                            <div className="text-xs text-slate-500">items</div>
                          </div>
                          <div className="sm:hidden">
                            <div className="text-sm font-bold text-indigo-400">
                              {caseItem.evidence_count || 0}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                          <Database className="w-8 h-8 text-slate-500" />
                        </div>
                        <div className="text-lg font-semibold text-slate-400">No cases available</div>
                        <div className="text-sm text-slate-500">Start by creating your first forensic investigation case</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default CaseTable;