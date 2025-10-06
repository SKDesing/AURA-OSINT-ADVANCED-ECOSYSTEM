import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Card,
  CardContent
} from '@mui/material';

interface NetworkEvidence {
  id: string;
  timestamp: number;
  type: string;
  url: string;
  method: string;
  isTikTok: boolean;
  hash?: string;
}

const NetworkMonitor: React.FC = () => {
  const [evidence, setEvidence] = useState<NetworkEvidence[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    tiktok: 0,
    https: 0,
    exported: 0
  });

  useEffect(() => {
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchNetworkData = async () => {
    try {
      const response = await fetch('/api/network/evidence');
      const data = await response.json();
      setEvidence(data);
      
      setStats({
        total: data.length,
        tiktok: data.filter((e: NetworkEvidence) => e.isTikTok).length,
        https: data.filter((e: NetworkEvidence) => e.type === 'HTTPS_CONNECT').length,
        exported: data.filter((e: NetworkEvidence) => e.hash).length
      });
    } catch (error) {
      console.error('Failed to fetch network data:', error);
    }
  };

  const exportEvidence = async () => {
    try {
      const response = await fetch('/api/network/export', { method: 'POST' });
      const result = await response.json();
      alert(`Evidence exported to: ${result.filepath}`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#fe2c55' }}>
        🌐 Network Monitor
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fe2c55, #ff6b35)' }}>
            <CardContent>
              <Typography variant="h6" color="white">Total Requests</Typography>
              <Typography variant="h3" color="white">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #25f4ee, #00d4ff)' }}>
            <CardContent>
              <Typography variant="h6" color="white">TikTok Requests</Typography>
              <Typography variant="h3" color="white">{stats.tiktok}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            <CardContent>
              <Typography variant="h6" color="white">HTTPS Connections</Typography>
              <Typography variant="h3" color="white">{stats.https}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            <CardContent>
              <Typography variant="h6" color="white">Evidence Saved</Typography>
              <Typography variant="h3" color="white">{stats.exported}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Intercepted Traffic</Typography>
        <Button 
          variant="contained" 
          onClick={exportEvidence}
          sx={{ background: 'linear-gradient(45deg, #fe2c55, #ff6b35)' }}
        >
          Export Evidence
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>URL</TableCell>
              <TableCell>TikTok</TableCell>
              <TableCell>Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evidence.slice(-50).reverse().map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.type} 
                    size="small"
                    color={item.type === 'HTTPS_CONNECT' ? 'secondary' : 'primary'}
                  />
                </TableCell>
                <TableCell>{item.method}</TableCell>
                <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.url}
                </TableCell>
                <TableCell>
                  {item.isTikTok && (
                    <Chip label="TikTok" size="small" color="error" />
                  )}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8em' }}>
                  {item.hash?.slice(0, 8)}...
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default NetworkMonitor;