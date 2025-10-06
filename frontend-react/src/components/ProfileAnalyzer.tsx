import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';

const ProfileAnalyzer: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analyzeProfile = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const response = await fetch('/api/profiles/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(data.profileData);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#fe2c55' }}>
        👤 Profile Analyzer
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              label="TikTok Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (without @)"
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={analyzeProfile}
              disabled={loading || !username.trim()}
              sx={{ 
                background: 'linear-gradient(45deg, #fe2c55, #ff6b35)',
                minWidth: 120
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Analyze'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Analysis Results</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                <Typography variant="body1">{result.username}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Display Name</Typography>
                <Typography variant="body1">{result.displayName}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Followers</Typography>
                <Typography variant="body1">{result.followerCount?.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Following</Typography>
                <Typography variant="body1">{result.followingCount?.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Videos</Typography>
                <Typography variant="body1">{result.videoCount?.toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Hearts</Typography>
                <Typography variant="body1">{result.heartCount?.toLocaleString()}</Typography>
              </Box>
            </Box>
            {result.bio && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Bio</Typography>
                <Typography variant="body2">{result.bio}</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProfileAnalyzer;