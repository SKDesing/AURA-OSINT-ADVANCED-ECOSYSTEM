import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Terminal: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#fe2c55' }}>
        💻 Terminal
      </Typography>

      <Paper 
        sx={{ 
          p: 2, 
          background: '#000',
          color: '#00ff00',
          fontFamily: 'monospace',
          minHeight: '400px'
        }}
      >
        <Typography variant="body2">
          AURA STEALTH SYSTEM v1.0 - Terminal Interface
          <br />
          ================================================
          <br />
          <br />
          🔒 Stealth Proxy: ACTIVE (Port 8888)
          <br />
          🌐 Network Interception: ENABLED
          <br />
          📊 Evidence Collection: RUNNING
          <br />
          🛡️  Security Level: MAXIMUM
          <br />
          <br />
          [INFO] All TikTok traffic intercepted
          <br />
          [INFO] Zero code injection detected
          <br />
          [INFO] Forensic evidence secured
          <br />
          <br />
          Type 'help' for available commands...
          <br />
          <span style={{ color: '#fe2c55' }}>aura@stealth:~$ </span>
          <span className="cursor">_</span>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Terminal;