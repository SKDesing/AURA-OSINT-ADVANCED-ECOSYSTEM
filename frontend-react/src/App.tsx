import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button } from '@mui/material';

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
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            background: 'linear-gradient(45deg, #fe2c55, #ff6b35)',
            px: 4,
            py: 1.5
          }}
        >
          Démarrer l'Application
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default App;