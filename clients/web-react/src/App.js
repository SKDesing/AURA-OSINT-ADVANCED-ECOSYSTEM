import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useAuth } from './hooks/useAuth';
import { useTheme } from './contexts/ThemeContext';

// Layouts
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import AuthLayout from './layouts/AuthLayout/AuthLayout';

// Components
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// Lazy load pages
const Dashboard = React.lazy(() => import('./views/Dashboard/Dashboard'));
const Login = React.lazy(() => import('./views/Auth/Login/Login'));
const OSINTDashboard = React.lazy(() => import('./views/OSINT/OSINTDashboard/OSINTDashboard'));
const TikTokAnalyzer = React.lazy(() => import('./views/OSINT/TikTokAnalyzer/TikTokAnalyzer'));
const ForensicTimeline = React.lazy(() => import('./views/Forensic/ForensicTimeline/ForensicTimeline'));
const RAGExplorer = React.lazy(() => import('./views/RAG/RAGExplorer/RAGExplorer'));
const Settings = React.lazy(() => import('./views/Settings/Settings'));
const NotFound = React.lazy(() => import('./views/NotFound/NotFound'));

function App() {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className={`app theme-${theme}`} data-theme={theme}>
      <Helmet>
        <title>AURA OSINT - Advanced Intelligence Platform</title>
        <meta name="description" content="Professional OSINT Platform for Advanced Intelligence Gathering" />
      </Helmet>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth/*" element={
              !isAuthenticated ? (
                <AuthLayout>
                  <Routes>
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/auth/login" replace />} />
                  </Routes>
                </AuthLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } />

            {/* Protected Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    
                    {/* OSINT Routes */}
                    <Route path="/osint" element={<OSINTDashboard />} />
                    <Route path="/osint/tiktok" element={<TikTokAnalyzer />} />
                    
                    {/* Forensic Routes */}
                    <Route path="/forensic" element={<ForensicTimeline />} />
                    
                    {/* RAG Routes */}
                    <Route path="/rag" element={<RAGExplorer />} />
                    
                    {/* Settings */}
                    <Route path="/settings" element={<Settings />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;