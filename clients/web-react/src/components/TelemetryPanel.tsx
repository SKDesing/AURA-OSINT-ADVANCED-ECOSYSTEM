import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

type TelemetryStats = {
  receivedLastMin?: number;
  receivedLast5Min?: number;
  errorsLastMin?: number;
  lastFlushTs?: number;
};

export default function TelemetryPanel() {
  const [stats, setStats] = useState<TelemetryStats>({});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch((process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4011') + '/telemetry/stats');
        if (!alive) return;
        if (res.ok) setStats(await res.json());
      } catch {}
    };
    load();
    const t = setInterval(load, 3000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>📡 Telemetry (navigateur)</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Collecte sans injection activée. Les métriques réseau/perf/erreurs sont envoyées en batch au backend.
      </Typography>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Métriques temps réel</Typography>
        <List>
          <ListItem>
            <ListItemText primary="Événements reçus (1min)" secondary={stats.receivedLastMin ?? '-'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Événements reçus (5min)" secondary={stats.receivedLast5Min ?? '-'} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Erreurs (1min)" secondary={stats.errorsLastMin ?? '-'} />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Dernier flush" 
              secondary={stats.lastFlushTs ? new Date(stats.lastFlushTs).toLocaleTimeString() : '-'} 
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}