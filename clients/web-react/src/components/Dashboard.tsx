import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip
} from '@mui/material';

interface SystemStats {
  totalProfiles: number;
  totalSessions: number;
  totalComments: number;
  totalGifts: number;
  activeSessions: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    totalProfiles: 0,
    totalSessions: 0,
    totalComments: 0,
    totalGifts: 0,
    activeSessions: 0
  });
  const [systemStatus, setSystemStatus] = useState('loading');

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reports/summary');
      const data = await response.json();
      setStats({
        totalProfiles: data.total_profiles || 0,
        totalSessions: data.total_sessions || 0,
        totalComments: data.total_comments || 0,
        totalGifts: data.total_gifts || 0,
        activeSessions: data.active_sessions || 0
      });
      setSystemStatus('operational');
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setSystemStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return '#10b981';
      case 'error': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#fe2c55' }}>
          🎯 AURA Dashboard
        </Typography>
        <Chip 
          label={systemStatus.toUpperCase()}
          sx={{ 
            background: getStatusColor(),
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #fe2c55, #ff6b35)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Profiles</Typography>
              <Typography variant="h3">{stats.totalProfiles}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #25f4ee, #00d4ff)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Sessions</Typography>
              <Typography variant="h3">{stats.totalSessions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card sx={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Comments</Typography>
              <Typography variant="h3">{stats.totalComments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Gifts</Typography>
              <Typography variant="h3">{stats.totalGifts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Active</Typography>
              <Typography variant="h3">{stats.activeSessions}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>🔒 Stealth System Status</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Proxy Stealth</Typography>
                <LinearProgress variant="determinate" value={100} sx={{ mb: 1 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Network Interception</Typography>
                <LinearProgress variant="determinate" value={100} sx={{ mb: 1 }} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Evidence Collection</Typography>
                <LinearProgress variant="determinate" value={95} sx={{ mb: 1 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>🚀 Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ background: 'linear-gradient(45deg, #fe2c55, #ff6b35)' }}
                  onClick={() => window.open('/live', '_self')}
                >
                  Start Live Tracking
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ background: 'linear-gradient(45deg, #25f4ee, #00d4ff)' }}
                  onClick={() => window.open('/profiles', '_self')}
                >
                  Analyze Profile
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ background: 'linear-gradient(45deg, #7c3aed, #a855f7)' }}
                  onClick={() => window.open('/network', '_self')}
                >
                  View Network Traffic
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;