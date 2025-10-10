import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';

type DoctorRow = { t: string; ts: number; name: string; version?: string; ok: boolean; err?: string; dur: number };

export default function DoctorPanel() {
  const [rows, setRows] = useState<DoctorRow[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    setRows([]);
    try {
      const res = await fetch((process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4011') + '/api/osint/doctor');
      const data = await res.json();
      setRows(data.rows || []);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">🧪 OSINT Doctor</Typography>
        <Button onClick={run} variant="contained" disabled={running}>{running ? 'Running...' : 'Run Doctor'}</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tool</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.name}</TableCell>
                <TableCell style={{ color: r.ok ? '#10b981' : '#ef4444' }}>{r.ok ? 'OK' : 'FAIL'}</TableCell>
                <TableCell>{r.version || '-'}</TableCell>
                <TableCell>{Math.round(r.dur)} ms</TableCell>
                <TableCell>{r.err || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}