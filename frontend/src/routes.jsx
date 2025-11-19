import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Loader from './components/ui/Loader';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CasesPage = lazy(() => import('./pages/CasesPage'));
const EvidencePage = lazy(() => import('./pages/EvidencePage'));
const UploadEvidencePage = lazy(() => import('./pages/UploadEvidencePage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const ChainOfCustodyPage = lazy(() => import('./pages/ChainOfCustodyPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="login" element={<AuthPage type="login" />} />
        <Route path="register" element={<AuthPage type="register" />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="cases/*"
          element={
            <ProtectedRoute>
              <CasesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="evidence"
          element={
            <ProtectedRoute>
              <EvidencePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="evidence/:caseId"
          element={
            <ProtectedRoute>
              <EvidencePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload/:caseId"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="chain-of-custody"
          element={
            <ProtectedRoute>
              <ChainOfCustodyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload-evidence"
          element={
            <ProtectedRoute>
              <UploadEvidencePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="upload-evidence/:caseId"
          element={
            <ProtectedRoute>
              <UploadEvidencePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;