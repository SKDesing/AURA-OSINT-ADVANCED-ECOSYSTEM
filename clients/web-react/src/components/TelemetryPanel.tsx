import React from 'react';
import { Box, Typography } from '@mui/material';

export function TelemetryPanel() {
  return (
    <Box p={2}>
      <Typography variant="h6">Telemetry (navigateur)</Typography>
      <Typography variant="body2" color="text.secondary">
        Collecte sans injection activée. Les métriques réseau/perf/erreurs sont envoyées en batch au backend.
      </Typography>
    </Box>
  );
}