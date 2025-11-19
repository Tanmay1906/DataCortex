import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCases } from '../../services/cases';
import { deleteCase } from '../../services/cases';
import CaseCard from './CaseCard';
import Loader from '../ui/Loader';
import Button from '../ui/Button';
import { motion } from 'framer-motion';

const CaseList = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await getCases();
      console.log('=== CASE DATA DEBUG ===');
      console.log('Raw fetched data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('First case example:', data[0]);
        console.log('All case statuses:', data.map(c => ({ id: c.id, title: c.title, status: c.status })));
        
        // Show unique status values
        const uniqueStatuses = [...new Set(data.map(c => c.status))];
        console.log('Unique status values found:', uniqueStatuses);
      }
      
      console.log('Cases with status breakdown:', {
        urgent: data.filter(c => c.status === 'urgent'),
        low: data.filter(c => c.status === 'low'),
        all: data.filter(c => c.status === 'all'),
        open: data.filter(c => c.status === 'open'),
        closed: data.filter(c => c.status === 'closed'),
        total: data.length
      });
      
      // Show all cases with their actual status values
      console.log('All cases with their status values:');
      data.forEach((c, index) => {
        console.log(`Case ${index + 1}: "${c.title}" - Status: "${c.status}" (Type: ${typeof c.status})`);
      });
      console.log('=== END DEBUG ===');
      
      setCases(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseDelete = (deletedCaseId) => {
    // Remove the deleted case from the local state for immediate UI update
    setCases(prevCases => prevCases.filter(c => c.id !== deletedCaseId));
    // Optionally refetch all cases to ensure consistency
    // fetchCases();
  };

  const handleDeleteAllCases = async () => {
    if (window.confirm(`Are you sure you want to delete ALL ${cases.length} cases? This action cannot be undone.`)) {
      try {
        setLoading(true);
        // Delete all cases one by one
        const deletePromises = cases.map(caseItem => 
          deleteCase(caseItem.id).catch(err => {
            console.error(`Failed to delete case ${caseItem.id}:`, err);
            return null;
          })
        );
        
        await Promise.all(deletePromises);
        
        // Refresh the cases list
        await fetchCases();
        
        alert('All cases have been deleted successfully!');
      } catch (error) {
        console.error('Error deleting all cases:', error);
        alert('Some cases could not be deleted. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCases();
  }, [refreshKey]);

  // Add event listener for when component becomes visible (useful for tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCases();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (loading) return <Loader />;
  if (error) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center p-8"
    >
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <span className="text-red-400 font-medium">{error}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl border border-cyan-500/30">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Case Management</h2>
            <p className="text-gray-400 text-sm font-light">
              Secure • Encrypted • Forensically Sound
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/cases/new">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all duration-300 hover:shadow-cyan-500/40 flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New Case</span>
              </Button>
            </motion.div>
          </Link>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => fetchCases()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-lg shadow-green-500/25 border border-green-400/30 transition-all duration-300 hover:shadow-green-500/40 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </Button>
          </motion.div>

          {cases.length > 0 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleDeleteAllCases}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-4 rounded-2xl shadow-lg shadow-red-500/25 border border-red-400/30 transition-all duration-300 hover:shadow-red-500/40 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete All</span>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Low Priority Cases</p>
              <p className="text-2xl font-bold text-white">
                {cases.filter(c => c.status === 'low' || c.status === 'open').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-orange-600/10 border border-red-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Urgent Cases</p>
              <p className="text-2xl font-bold text-white">
                {cases.filter(c => c.status === 'urgent').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Cases</p>
              <p className="text-2xl font-bold text-white">{cases.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cases Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {cases.map((caseItem, index) => (
          <motion.div
            key={caseItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <CaseCard caseItem={caseItem} onDelete={handleCaseDelete} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {cases.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border border-cyan-500/30">
            <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Cases Found</h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Start your digital investigation by creating your first forensic case
          </p>
          <Link to="/cases/new">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-cyan-500/25">
              Create First Case
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default CaseList;