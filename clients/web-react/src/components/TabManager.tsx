import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const TabManager: React.FC = () => {
  const openService = (name: string, url: string) => {
    // Ouvrir dans un nouvel onglet de la même fenêtre
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3,
      p: 2,
      backgroundColor: '#161823',
      borderRadius: 2,
      flexWrap: 'wrap'
    }}>
      <Typography variant="h6" sx={{ color: '#fe2c55', width: '100%', mb: 1 }}>
        🚀 Services AURA
      </Typography>
      
      <Button 
        variant="outlined"
        onClick={() => openService('Backend API', 'http://localhost:4000')}
        sx={{ 
          borderColor: '#25f4ee', 
          color: '#25f4ee',
          '&:hover': { backgroundColor: 'rgba(37, 244, 238, 0.1)' }
        }}
      >
        Backend API
      </Button>
      
      <Button 
        variant="outlined"
        onClick={() => openService('Interface USB', 'http://localhost:8080')}
        sx={{ 
          borderColor: '#feca57', 
          color: '#feca57',
          '&:hover': { backgroundColor: 'rgba(254, 202, 87, 0.1)' }
        }}
      >
        Interface USB
      </Button>
      
      <Button 
        variant="outlined"
        onClick={() => openService('MinIO Console', 'http://localhost:9001')}
        sx={{ 
          borderColor: '#ff6b35', 
          color: '#ff6b35',
          '&:hover': { backgroundColor: 'rgba(255, 107, 53, 0.1)' }
        }}
      >
        MinIO Console
      </Button>
    </Box>
  );
};

export default TabManager;