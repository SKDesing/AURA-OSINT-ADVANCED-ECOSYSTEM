import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material';

const LiveTracker: React.FC = () => {
  const [liveUrl, setLiveUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [message, setMessage] = useState('');

  const startTracking = async () => {
    if (!liveUrl.trim()) return;
    
    try {
      const response = await fetch('/api/capture/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liveUrl: liveUrl.trim(), title: title.trim() })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsTracking(true);
        setMessage(`Tracking started - Session ID: ${data.sessionId}`);
      } else {
        setMessage('Failed to start tracking');
      }
    } catch (err) {
      setMessage('Network error occurred');
    }
  };

  const stopTracking = async () => {
    try {
      const response = await fetch('/api/capture/stop', {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsTracking(false);
        setMessage('Tracking stopped successfully');
      }
    } catch (err) {
      setMessage('Failed to stop tracking');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#fe2c55' }}>
        📺 Live Tracker
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="TikTok Live URL"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@username/live"
              disabled={isTracking}
            />
            <TextField
              fullWidth
              label="Session Title (Optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Live session description"
              disabled={isTracking}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={startTracking}
                disabled={isTracking || !liveUrl.trim()}
                sx={{ 
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  flex: 1
                }}
              >
                Start Tracking
              </Button>
              <Button
                variant="contained"
                onClick={stopTracking}
                disabled={!isTracking}
                sx={{ 
                  background: 'linear-gradient(45deg, #ef4444, #f87171)',
                  flex: 1
                }}
              >
                Stop Tracking
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {message && (
        <Alert severity={isTracking ? 'success' : 'info'} sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {isTracking && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>🔴 Live Tracking Active</Typography>
            <Typography variant="body2" color="text.secondary">
              The system is now intercepting and logging all TikTok Live data through the stealth proxy.
              All comments, gifts, and interactions are being captured for forensic analysis.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LiveTracker;