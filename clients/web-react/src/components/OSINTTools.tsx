import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Search, Security, Phone, Web, Email } from '@mui/icons-material';

interface OSINTTool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

interface OSINTResult {
  id: string;
  type: string;
  value: string;
  source: string;
}

const OSINTTools: React.FC = () => {
  const [tools, setTools] = useState<OSINTTool[]>([]);
  const [results, setResults] = useState<OSINTResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('example.com');
  const [error, setError] = useState<string | null>(null);

  const defaultTools: OSINTTool[] = [
    { id: 'amass', name: 'Amass', description: 'Subdomain enumeration', icon: <Search />, category: 'Domain' },
    { id: 'subfinder', name: 'Subfinder', description: 'Fast subdomain discovery', icon: <Web />, category: 'Domain' },
    { id: 'phoneinfoga', name: 'PhoneInfoga', description: 'Phone number investigation', icon: <Phone />, category: 'Phone' },
    { id: 'maigret', name: 'Maigret', description: 'Username investigation', icon: <Security />, category: 'Username' },
    { id: 'holehe', name: 'Holehe', description: 'Email account finder', icon: <Email />, category: 'Email' }
  ];

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch('http://localhost:4011/api/osint/tools');
      if (response.ok) {
        const data = await response.json();
        setTools(data.tools || defaultTools);
      } else {
        setTools(defaultTools);
      }
    } catch (err) {
      setTools(defaultTools);
    }
  };

  const runTool = async (toolId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:4011/api/osint/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          params: { domain, passive: true }
        })
      });

      if (response.ok) {
        const job = await response.json();
        // Simuler l'attente des résultats
        setTimeout(() => fetchResults(), 2000);
      } else {
        setError('Failed to start job');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:4011/api/osint/results');
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.error('Failed to fetch results');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#fe2c55' }}>
        🔍 OSINT Tools
      </Typography>

      <Card sx={{ mb: 3, bgcolor: '#161823' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Target Configuration</Typography>
          <TextField
            fullWidth
            label="Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid xs={12} md={6} lg={4} key={tool.id}>
            <Card sx={{ bgcolor: '#161823', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tool.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {tool.name}
                  </Typography>
                  <Chip 
                    label={tool.category} 
                    size="small" 
                    sx={{ ml: 'auto', bgcolor: '#25f4ee', color: '#000' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => runTool(tool.id)}
                  disabled={loading}
                  sx={{ 
                    bgcolor: '#fe2c55',
                    '&:hover': { bgcolor: '#e02347' }
                  }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Run Tool'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {results.length > 0 && (
        <Card sx={{ mt: 3, bgcolor: '#161823' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              📊 Results ({results.length})
            </Typography>
            <List>
              {results.slice(0, 10).map((result, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={result.value}
                    secondary={`Type: ${result.type} | Source: ${result.source}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default OSINTTools;