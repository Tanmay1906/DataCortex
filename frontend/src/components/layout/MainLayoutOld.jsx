import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-forensics-slate-950 via-forensics-slate-900 to-forensics-navy-950 relative overflow-hidden">
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

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-forensics-cyber-500/10 to-forensics-navy-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 120, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2,
          }}
          className="absolute top-3/4 right-1/3 w-48 h-48 bg-gradient-to-r from-forensics-navy-500/10 to-forensics-cyber-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Main Layout Structure */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <div className="flex flex-1 overflow-hidden">
          {user && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="shrink-0"
            >
              <Sidebar />
            </motion.div>
          )}
          
          <main className="flex-1 relative overflow-auto">
            {/* Content Container */}
            <div className="relative z-10 min-h-full">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full"
                >
                  <Outlet />
                </motion.div>
              </div>
            </div>
            
            {/* Background Scan Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="h-px bg-gradient-to-r from-transparent via-forensics-cyber-500/30 to-transparent animate-pulse" 
                   style={{ top: '20%' }} />
              <div className="h-px bg-gradient-to-r from-transparent via-forensics-cyber-500/20 to-transparent animate-pulse delay-1000" 
                   style={{ top: '40%' }} />
              <div className="h-px bg-gradient-to-r from-transparent via-forensics-cyber-500/25 to-transparent animate-pulse delay-2000" 
                   style={{ top: '60%' }} />
              <div className="h-px bg-gradient-to-r from-transparent via-forensics-cyber-500/15 to-transparent animate-pulse delay-3000" 
                   style={{ top: '80%' }} />
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;