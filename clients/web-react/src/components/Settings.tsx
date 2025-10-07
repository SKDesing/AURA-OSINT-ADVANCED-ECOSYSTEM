import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  Divider
} from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#fe2c55' }}>
        ⚙️ Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>🔒 Stealth Configuration</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Network Proxy Interception"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Forensic Evidence Logging"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Real-time Data Capture"
            />
            <FormControlLabel
              control={<Switch />}
              label="Debug Mode"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>📊 Data Management</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="outlined" 
              fullWidth
              sx={{ borderColor: '#fe2c55', color: '#fe2c55' }}
            >
              Export All Evidence
            </Button>
            <Button 
              variant="outlined" 
              fullWidth
              sx={{ borderColor: '#25f4ee', color: '#25f4ee' }}
            >
              Clear Network Cache
            </Button>
            <Divider />
            <Button 
              variant="outlined" 
              color="error"
              fullWidth
            >
              Reset System
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>ℹ️ System Information</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Version</Typography>
              <Typography variant="body1">AURA Stealth v1.0</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Proxy Port</Typography>
              <Typography variant="body1">8888</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Frontend Port</Typography>
              <Typography variant="body1">3000</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Backend Port</Typography>
              <Typography variant="body1">4000</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;