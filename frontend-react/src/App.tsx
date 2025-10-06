import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button } from '@mui/material';
import TabManager from './components/TabManager';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#fe2c55' },
    secondary: { main: '#25f4ee' },
    background: { default: '#000000', paper: '#161823' },
  },
});

const App: React.FC = () => {
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
        
        <TabManager />
        <Button 
          variant="contained" 
          size="large"
          onClick={() => {
            // Ouvrir tous les services dans des onglets de la même fenêtre
            window.open('http://localhost:4000', '_blank');
            setTimeout(() => window.open('http://localhost:8080', '_blank'), 500);
            setTimeout(() => window.open('http://localhost:9001', '_blank'), 1000);
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
          Ouvrir Tous les Services
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default App;