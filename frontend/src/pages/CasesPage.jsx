import { Routes, Route } from 'react-router-dom';
import CaseList from '../components/cases/CaseList';
import CaseForm from '../components/cases/CaseForm';
import CaseDetailPage from './cases/CaseDetailPage';
import { motion } from 'framer-motion';
import { Shield, Plus, Search, Filter, FileText, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Card, CardBody } from '../components/ui/Card';
import { StatsGrid, StatCard } from '../components/ui/StatCard';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useEffect, useState } from 'react';

const CasesPage = () => {
  return (
    <Routes>
      <Route index element={<CaseListPage />} />
      <Route path="new" element={<CaseFormPage />} />
      <Route path=":id" element={<CaseDetailPage />} />
    </Routes>
  );
};

const CaseListPage = () => {
  // Statistics
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/cases/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center space-x-3">
              <Shield className="w-8 h-8 text-forensics-cyber-400" />
              <span>Case Management</span>
            </h1>
            <p className="text-forensics-slate-300 text-lg">
              Monitor and manage all forensic investigations with advanced tracking
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search cases..."
              icon={Search}
              className="w-72"
            />
            
            <Button variant="secondary" size="md">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button 
              variant="primary" 
              size="md"
              onClick={() => window.location.href = '/cases/new'}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <StatsGrid columns={4}>
            <StatCard
              title="Total Cases"
              value={stats.totalCases}
              change={stats.totalCasesChange}
              changeType={stats.totalCasesChangeType}
              icon={FileText}
              description="vs last month"
            />
            <StatCard
              title="Active Cases"
              value={stats.activeCases}
              change={stats.activeCasesChange}
              changeType={stats.activeCasesChangeType}
              icon={Clock}
              description="currently open"
              variant="success"
            />
            <StatCard
              title="Pending Review"
              value={stats.pendingReview}
              change={stats.pendingReviewChange}
              changeType={stats.pendingReviewChangeType}
              icon={AlertCircle}
              description="awaiting approval"
              variant="warning"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              change={stats.completedChange}
              changeType={stats.completedChangeType}
              icon={CheckCircle}
              description="successfully closed"
            />
          </StatsGrid>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center space-x-6 text-sm"
      >
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span className="text-forensics-slate-300">System Operational</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-forensics-cyber-400" />
          <span className="text-forensics-slate-300">8 Active Investigators</span>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="primary" size="sm">Live Tracking</Badge>
          <Badge variant="success" size="sm">Blockchain Verified</Badge>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardBody>
            <CaseList />
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const CaseFormPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 flex items-center space-x-3">
              <Plus className="w-8 h-8 text-forensics-cyber-400" />
              <span>Create New Case</span>
            </h1>
            <p className="text-forensics-slate-300 text-lg">
              Initialize a new forensic investigation with secure protocols
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="success" size="sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
                Security Level: Maximum
              </Badge>
              <Badge variant="primary" size="sm">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Verification
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardBody>
            <CaseForm />
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CasesPage;