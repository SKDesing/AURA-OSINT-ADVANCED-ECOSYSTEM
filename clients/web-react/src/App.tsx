import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Tabs, Tab } from '@mui/material';
import TabManager from './components/TabManager';
import OSINTTools from './components/OSINTTools';

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
          🚀 TikTok Live Analyser
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Application forensique prête pour déploiement
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
          Solution complète d'analyse forensique pour TikTok Live avec interface moderne, 
          outils OSINT intégrés et package USB commercial.
        </Typography>
        
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Dashboard" />
          <Tab label="OSINT Tools" />
          <Tab label="Live Tracker" />
        </Tabs>

        {activeTab === 0 && <TabManager />}
        {activeTab === 1 && <OSINTTools />}
        {activeTab === 2 && (
          <Typography variant="h6" color="text.secondary">
            🔴 Live Tracker - Coming Soon
          </Typography>
        )}
        {activeTab === 0 && (
          <Button 
            variant="contained" 
            size="large"
            onClick={() => {
              // Ouvrir tous les services dans des onglets de la même fenêtre
              window.open('http://localhost:4011/health', '_blank');
              window.open('http://localhost:5005', '_blank');
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
            Ouvrir Services OSINT
          </Button>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default App;