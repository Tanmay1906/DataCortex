import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-forensics-slate-950 via-forensics-slate-900 to-forensics-navy-950 relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 w-full h-full opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      {/* Floating Orbs - Reduced and Subtle */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-forensics-cyber-500/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-3/4 right-1/4 w-40 h-40 bg-forensics-navy-500/5 rounded-full blur-xl"
        />
      </div>

      {/* Grid Lines - More Subtle */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-forensics-cyber-500/5 to-transparent transform rotate-45" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 98px, rgba(8, 145, 178, 0.03) 100px)' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Navigation - Only show when authenticated */}
        {isAuthenticated && <Header />}
        
        {/* Main Content Area */}
        <main className={`flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${!isAuthenticated ? 'flex items-center justify-center' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer - Only show when authenticated */}
        {isAuthenticated && <Footer />}
      </div>

      {/* Professional Scan Line Effect */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-forensics-cyber-400 to-transparent opacity-30 pointer-events-none">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 2,
          }}
          className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 blur-sm"
        />
      </div>
    </div>
  );
};

export default MainLayout;
