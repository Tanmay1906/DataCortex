import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCases } from '../../services/cases';
import { getEvidence } from '../../services/evidence';
import { StatCard, StatsGrid } from '../ui/StatCard';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card';
import { 
  FolderOpen, 
  FileText, 
  Database, 
  Users, 
  Activity,
  TrendingUp,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import Loader from '../ui/Loader';
import Badge from '../ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    cases: 0,
    evidence: 0,
    blockchainTx: 0,
    users: 0,
    activeCases: 0,
    pendingReview: 0,
    completedToday: 0,
    systemUptime: '99.9%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cases, evidence] = await Promise.all([
          getCases(),
          getEvidence(),
        ]);

        // In a real app, these would come from dedicated stats endpoints
        setStats({
          cases: cases.length,
          evidence: evidence.length,
          blockchainTx: evidence.filter((e) => e.txHash).length,
          users: 42, // Mock data - would come from backend
          activeCases: cases.filter(c => c.status === 'active').length,
          pendingReview: cases.filter(c => c.status === 'pending').length,
          completedToday: 3, // Mock data
          systemUptime: '99.9%'
        });

        // Mock recent activity data
        setRecentActivity([
          {
            id: 1,
            type: 'case_created',
            message: 'New case "Mobile Device Analysis" created',
            user: 'Detective Smith',
            timestamp: '2 minutes ago',
            icon: FolderOpen,
            color: 'text-blue-400'
          },
          {
            id: 2,
            type: 'evidence_uploaded',
            message: 'Evidence uploaded to case #TRM-2025-0156',
            user: 'Forensics Team',
            timestamp: '15 minutes ago',
            icon: FileText,
            color: 'text-green-400'
          },
          {
            id: 3,
            type: 'blockchain_verified',
            message: 'Chain of custody verified on blockchain',
            user: 'System',
            timestamp: '1 hour ago',
            icon: Shield,
            color: 'text-forensics-cyber-400'
          },
          {
            id: 4,
            type: 'case_closed',
            message: 'Case "Network Intrusion" marked as complete',
            user: 'Lead Investigator',
            timestamp: '3 hours ago',
            icon: CheckCircle,
            color: 'text-purple-400'
          }
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader variant="forensics" message="Loading dashboard data..." />;
  if (error) return (
    <div className="flex items-center justify-center py-12">
      <Card variant="danger">
        <CardBody>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">Error Loading Dashboard</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl lg:text-4xl font-black text-white flex items-center space-x-3">
            <Activity className="w-8 h-8 text-forensics-cyber-400" />
            <span>Admin Dashboard</span>
          </h1>
          <div className="flex items-center space-x-4">
            <Badge variant="success" size="sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
              System Operational
            </Badge>
            <Badge variant="primary" size="sm">
              Uptime: {stats.systemUptime}
            </Badge>
          </div>
        </div>
        <p className="text-forensics-slate-300 text-lg">
          Monitor system performance and investigate analytics
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatsGrid columns={4}>
          <StatCard
            title="Total Cases"
            value={stats.cases}
            change="+0%"
            changeType="normal"
            icon={FolderOpen}
            description="vs last month"
            variant="default"
          />
          <StatCard
            title="Evidence Items"
            value={stats.evidence}
            change="+24%"
            changeType="positive"
            icon={FileText}
            description="vs last month"
            variant="success"
          />
          <StatCard
            title="Blockchain TXs"
            value={stats.blockchainTx}
            change="+8%"
            changeType="neutral"
            icon={Database}
            description="vs last month"
            variant="default"
          />
          <StatCard
            title="Active Users"
            value={stats.users}
            change="0%"
            changeType="neutral"
            icon={Users}
            description="No change"
            variant="default"
          />
        </StatsGrid>
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <StatsGrid columns={4}>
          <StatCard
            title="Active Cases"
            value={stats.activeCases}
            icon={Clock}
            variant="warning"
            description="currently open"
          />
          <StatCard
            title="Pending Review"
            value={stats.pendingReview}
            icon={AlertTriangle}
            variant="warning"
            description="awaiting approval"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday}
            icon={CheckCircle}
            variant="success"
            description="cases closed"
          />
          <StatCard
            title="System Performance"
            value="Optimal"
            icon={Zap}
            variant="success"
            description="all systems green"
          />
        </StatsGrid>
      </motion.div>

      {/* Recent Activity and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-forensics-cyber-400" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      className="flex items-start space-x-3 p-3 glass-effect border border-forensics-cyber-500/20 rounded-xl"
                    >
                      <Icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">
                          {activity.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-forensics-slate-400 text-xs">
                            by {activity.user}
                          </span>
                          <span className="text-forensics-slate-500 text-xs">•</span>
                          <span className="text-forensics-slate-400 text-xs">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* System Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-400" />
                <span>System Health</span>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-6">
                {/* Security Status */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-forensics-slate-300 uppercase tracking-wide">
                    Security Metrics
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-forensics-slate-300 text-sm">Encryption Status</span>
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-forensics-slate-300 text-sm">Blockchain Sync</span>
                      <Badge variant="success" size="sm">Synced</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-forensics-slate-300 text-sm">Backup Status</span>
                      <Badge variant="success" size="sm">Current</Badge>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-forensics-slate-300 uppercase tracking-wide">
                    Performance
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-forensics-slate-300 text-sm">CPU Usage</span>
                        <span className="text-forensics-cyber-400 text-sm font-medium">23%</span>
                      </div>
                      <div className="w-full bg-forensics-slate-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-forensics-cyber-500 to-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '23%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-forensics-slate-300 text-sm">Memory Usage</span>
                        <span className="text-green-400 text-sm font-medium">67%</span>
                      </div>
                      <div className="w-full bg-forensics-slate-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '67%' }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-forensics-slate-300 text-sm">Storage</span>
                        <span className="text-yellow-400 text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full bg-forensics-slate-700 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: '45%' }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;