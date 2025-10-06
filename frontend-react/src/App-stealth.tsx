import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import NetworkMonitor from './components/NetworkMonitor';
import ProfileAnalyzer from './components/ProfileAnalyzer';
import LiveTracker from './components/LiveTracker';
import Terminal from './components/Terminal';
import Settings from './components/Settings';
import Navigation from './components/Navigation';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#fe2c55' },
    secondary: { main: '#25f4ee' },
    background: { default: '#000000', paper: 'rgba(22, 24, 35, 0.8)' },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(254, 44, 85, 0.1)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Navigation />
          <main style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/network" element={<NetworkMonitor />} />
              <Route path="/profiles" element={<ProfileAnalyzer />} />
              <Route path="/live" element={<LiveTracker />} />
              <Route path="/terminal" element={<Terminal />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;