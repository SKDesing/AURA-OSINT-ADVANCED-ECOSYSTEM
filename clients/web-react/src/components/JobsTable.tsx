import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Tooltip } from '@mui/material';
import { apiGet, apiPost } from '../api/client';
import { OsintJob } from '../types/osint';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';

export default function JobsTable() {
  const [jobs, setJobs] = useState<OsintJob[]>([]);

  const load = async () => {
    try {
      const data = await apiGet<{ jobs: OsintJob[] }>('/api/osint/jobs');
      setJobs(data.jobs || []);
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  const cancel = async (id: string | number) => {
    try { await apiPost(`/api/osint/jobs/${id}/cancel`); load(); } catch {}
  };
  const retry = async (id: string | number) => {
    try { await apiPost(`/api/osint/jobs/${id}/retry`); load(); } catch {}
  };

  const color = (s?: string) => s === 'completed' ? 'success' : s === 'failed' ? 'error' : s === 'active' ? 'warning' : 'default';

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>🧰 Jobs</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Job ID</TableCell>
              <TableCell>Tool</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.slice(0, 50).map(j => (
              <TableRow key={String(j.id || j.jobId)}>
                <TableCell>{String(j.id || j.jobId)}</TableCell>
                <TableCell>{j.toolId}</TableCell>
                <TableCell><Chip label={j.status} color={color(j.status) as any} size="small" /></TableCell>
                <TableCell>{j.createdAt ? new Date(j.createdAt).toLocaleString() : '-'}</TableCell>
                <TableCell>{j.durationMs ? `${Math.round(j.durationMs/1000)}s` : '-'}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Cancel"><IconButton onClick={() => cancel(j.id || j.jobId!)}><CancelIcon /></IconButton></Tooltip>
                  <Tooltip title="Retry"><IconButton onClick={() => retry(j.id || j.jobId!)}><ReplayIcon /></IconButton></Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}