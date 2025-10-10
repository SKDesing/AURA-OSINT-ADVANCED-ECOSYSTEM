import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { apiGet } from '../api/client';
import { OsintJob } from '../types/osint';

export default function JobDetails({ jobId }: { jobId: string | number }) {
  const [job, setJob] = useState<OsintJob | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<OsintJob>(`/api/osint/jobs/${jobId}`);
        setJob(data);
      } catch {}
    };
    load();
    const t = setInterval(load, 1000);
    return () => clearInterval(t);
  }, [jobId]);

  return (
    <Box>
      <Typography variant="h6">Job #{String(jobId)}</Typography>
      <Paper style={{ padding: 12, marginTop: 8 }}>
        <div>Tool: {job?.toolId}</div>
        <div>Status: <Chip size="small" label={job?.status || '-'} /></div>
        <div>Created: {job?.createdAt ? new Date(job.createdAt).toLocaleString() : '-'}</div>
        <div>Duration: {job?.durationMs ? `${Math.round(job.durationMs/1000)}s` : '-'}</div>
        <div>Params: <pre style={{ margin: 0 }}>{JSON.stringify(job?.params || {}, null, 2)}</pre></div>
      </Paper>
    </Box>
  );
}