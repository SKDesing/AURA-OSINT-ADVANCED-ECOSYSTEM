import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import TabManager from './components/TabManager';
import OSINTTools from './components/OSINTTools';
import JobsTable from './components/JobsTable';
import ResultsTable from './components/ResultsTable';
import TelemetryPanel from './components/TelemetryPanel';
import DoctorPanel from './components/DoctorPanel';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#fe2c55' },
    secondary: { main: '#25f4ee' },
    background: { default: '#000000', paper: '#161823' },
  },
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography variant="h2" sx={{ 
          background: 'linear-gradient(45deg, #fe2c55, #25f4ee)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
          fontWeight: 'bold'
        }}>
          AURA OSINT ADVANCED ECOSYSTEM
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Interface unifiée: outils, jobs, résultats, télémétrie
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab label="Dashboard" />
          <Tab label="OSINT Tools" />
          <Tab label="Jobs" />
          <Tab label="Results" />
          <Tab label="Telemetry" />
          <Tab label="Live Tracker" />
        </Tabs>

        <Box sx={{ width: '100%', maxWidth: 1200, textAlign: 'left' }}>
          {activeTab === 0 && (
            <Box>
              <TabManager />
              <Box sx={{ mt: 4 }}>
                <DoctorPanel />
              </Box>
            </Box>
          )}
          {activeTab === 1 && <OSINTTools />}
          {activeTab === 2 && <JobsTable />}
          {activeTab === 3 && <ResultsTable />}
          {activeTab === 4 && <TelemetryPanel />}
          {activeTab === 5 && (
            <Typography variant="h6" color="text.secondary">
              🔴 Live Tracker - Coming Soon
            </Typography>
          )}
        </Box>
        {activeTab === 0 && (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => {
              window.open((process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4011') + '/health', '_blank');
            }}
            sx={{ 
              background: 'linear-gradient(45deg, #fe2c55, #ff6b35)',
              px: 4,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(45deg, #e02347, #e55a2b)',
                transform: 'scale(1.05)'
              }
            }}
          >
            Open Backend Health
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;