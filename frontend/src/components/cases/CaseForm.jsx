import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createCase } from '../../services/cases';
import api from '../../services/api';
import Button from '../ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Plus,
  FileText,
  Hash,
  AlignLeft,
  CheckCircle,
  AlertTriangle,
  User,
  Archive,
  Lock,
  Zap
} from 'lucide-react';

const CaseForm = () => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [nextCaseNumber, setNextCaseNumber] = useState('');
  const [loadingCaseNumber, setLoadingCaseNumber] = useState(true);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch the next case number when component mounts
  useEffect(() => {
    const fetchNextCaseNumber = async () => {
      try {
        setLoadingCaseNumber(true);
        const response = await api.get('/cases/next-case-number');
        const caseNumber = response.data.nextCaseNumber;
        setNextCaseNumber(caseNumber);
        setValue('caseNumber', caseNumber);
      } catch (error) {
        console.error('Error fetching next case number:', error);
        setAlert({
          type: 'error',
          title: 'Error',
          message: 'Failed to fetch case number. Please try again.',
        });
      } finally {
        setLoadingCaseNumber(false);
      }
    };

    fetchNextCaseNumber();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      await createCase(data);
      setAlert({
        type: 'success',
        title: 'Success',
        message: 'Case created successfully!',
      });
      // Small delay to show the alert before navigation
      setTimeout(() => {
        navigate('/cases', { replace: true });
      }, 1500);
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create case',
      });
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          isVisible={true}
          onClose={() => setAlert(null)}
          autoClose={alert.type === 'success'}
          autoCloseDelay={3000}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center space-x-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-4 glass-effect border border-forensics-cyber-500/30 rounded-2xl"
          >
            <Plus className="w-10 h-10 text-forensics-cyber-400" />
          </motion.div>
        </div>
        <h2 className="text-4xl font-black bg-gradient-to-r from-white to-forensics-cyber-300 bg-clip-text text-transparent mb-4">
          Create New Forensic Case
        </h2>
        <p className="text-forensics-slate-300 text-lg max-w-2xl mx-auto">
          Initialize a new digital investigation with forensic-grade security and blockchain verification
        </p>
      </motion.div>

      {/* Security Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center justify-center space-x-6 text-sm"
      >
        <div className="flex items-center space-x-2 text-green-400">
          <Lock className="w-4 h-4" />
          <span>Secure Connection</span>
        </div>
        <div className="flex items-center space-x-2 text-forensics-cyber-400">
          <Shield className="w-4 h-4" />
          <span>Encrypted Data</span>
        </div>
        <div className="flex items-center space-x-2 text-blue-400">
          <Zap className="w-4 h-4" />
          <span>Blockchain Ready</span>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-forensics-cyber-400" />
              <span>Case Information</span>
            </CardTitle>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <Input
                label="Case Title"
                icon={FileText}
                placeholder="Enter forensic case title..."
                error={errors.title?.message}
                className="glass-card border-forensics-government-blue focus:border-forensics-neon-cyan text-white placeholder-forensics-neutral-gray bg-forensics-surface-primary"
                {...register('title', { required: 'Title is required' })}
              />

              {/* Case Number Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-forensics-slate-300">
                  Case Number
                  <span className="text-green-400 text-xs ml-2">(Auto-generated)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400" />
                  <input
                    value={nextCaseNumber}
                    readOnly
                    className="w-full pl-12 pr-4 py-3 glass-card border-forensics-success rounded-xl text-forensics-success font-mono cursor-not-allowed focus:border-forensics-success focus:outline-none bg-forensics-surface-secondary placeholder-forensics-neutral-gray transition-all duration-300"
                    placeholder={loadingCaseNumber ? "Generating..." : "TRM-YYYY-NNNN"}
                  />
                  {loadingCaseNumber && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs text-forensics-slate-400 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Unique case number automatically assigned</span>
                </p>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-forensics-slate-300">
                  Case Description *
                </label>
                <div className="relative">
                  <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-forensics-slate-400" />
                  <textarea
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 glass-card border-forensics-government-blue rounded-xl text-white placeholder-forensics-neutral-gray bg-forensics-surface-primary focus:border-forensics-neon-cyan focus:outline-none focus:ring-2 focus:ring-forensics-neon-cyan/20 transition-all duration-300 resize-none"
                    placeholder="Detailed description of the digital forensic investigation..."
                    {...register('description', { required: 'Description is required' })}
                  />
                </div>
                {errors.description && (
                  <p className="text-sm text-red-400 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{errors.description.message}</span>
                  </p>
                )}
              </div>

              {/* Status and Priority Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-forensics-slate-300">
                    Case Status *
                  </label>
                  <select
                    className="w-full px-4 py-3 glass-card border-forensics-government-blue rounded-xl text-white"
                    style={{ backgroundColor: 'rgba(27, 43, 75, 0.8)' }}
                    /* ...existing classes... */
                    /* focus:border-forensics-neon-cyan focus:outline-none focus:ring-2 focus:ring-forensics-neon-cyan/20 transition-all duration-300 */
                    {...register('status', { required: 'Status is required' })}
                  >
                    <option value="" className="bg-forensics-surface-secondary text-forensics-neutral-gray">Select status...</option>
                    <option value="urgent" className="bg-slate-800 text-white">� Urgent</option>
                    <option value="low" className="bg-slate-800 text-white">� Low Priority</option>
                    <option value="all" className="bg-slate-800 text-white">🔵 All Cases</option>
                  </select>
                  {errors.status && (
                    <p className="text-sm text-red-400 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.status.message}</span>
                    </p>
                  )}
                </div>

                {/* Priority Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-forensics-slate-300">
                    Priority Level *
                  </label>
                  <select
                    className="w-full px-4 py-3 glass-card border-forensics-government-blue rounded-xl text-white"
                    style={{ backgroundColor: 'rgba(27, 43, 75, 0.8)' }}
                    /* ...existing classes... */
                    /* focus:border-forensics-danger focus:outline-none focus:ring-2 focus:ring-forensics-danger/20 transition-all duration-300 */
                    {...register('priority', { required: 'Priority is required' })}
                  >
                    <option value="" className="bg-slate-800">Select priority...</option>
                    <option value="low" className="bg-slate-800 text-forensics-warning">🟡 Low Priority</option>
                    <option value="medium" className="bg-slate-800 text-forensics-warning">🟠 Medium Priority</option>
                    <option value="high" className="bg-slate-800 text-forensics-danger">🔴 High Priority</option>
                    <option value="critical" className="bg-slate-800 text-forensics-danger">🚨 Critical</option>
                  </select>
                  {errors.priority && (
                    <p className="text-sm text-red-400 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.priority.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Investigator Field */}
                <Input
                  label="Lead Investigator"
                  icon={User}
                  placeholder="Assigned investigator name..."
                  className="glass-card border-forensics-government-blue focus:border-forensics-neon-cyan text-white placeholder-forensics-neutral-gray bg-forensics-surface-primary"
                  {...register('investigator')}
                />

                {/* Evidence Type Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-forensics-slate-300">
                    Primary Evidence Type
                  </label>
                  <select
                    className="w-full px-4 py-3 glass-card border-forensics-government-blue rounded-xl text-white"
                    style={{ backgroundColor: 'rgba(27, 43, 75, 0.8)' }}
                    /* ...existing classes... */
                    /* focus:border-forensics-neon-cyan focus:outline-none focus:ring-2 focus:ring-forensics-neon-cyan/20 transition-all duration-300 */
                    {...register('evidenceType')}
                  >
                    <option value="" className="bg-slate-800">Select evidence type...</option>
                    <option value="mobile" className="bg-slate-800 text-forensics-government-blue-light">📱 Mobile Device</option>
                    <option value="computer" className="bg-slate-800 text-forensics-government-blue-light">💻 Computer/Laptop</option>
                    <option value="storage" className="bg-slate-800 text-forensics-warning">💾 Storage Media</option>
                    <option value="network" className="bg-slate-800 text-forensics-neon-cyan">🌐 Network Evidence</option>
                    <option value="cloud" className="bg-slate-800 text-forensics-neon-cyan">☁️ Cloud Data</option>
                    <option value="other" className="bg-slate-800 text-forensics-neutral-gray">📁 Other</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-forensics-slate-700/50">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/cases')}
                  className="flex-1"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Create Forensic Case
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CaseForm;