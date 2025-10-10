import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from '@mui/material';
import { apiGet } from '../api/client';
import { OsintResult } from '../types/osint';

export default function ResultsTable() {
  const [results, setResults] = useState<OsintResult[]>([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState<string>('');

  const load = async () => {
    try {
      const data = await apiGet<{ results: OsintResult[] }>('/api/osint/results', { query: { q, type } });
      setResults(data.results || []);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>📦 Results</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField size="small" label="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <TextField size="small" label="Type (subdomain/account/email_usage)" value={type} onChange={(e) => setType(e.target.value)} />
        <Button variant="contained" onClick={load}>Filter</Button>
        <Button 
          variant="outlined" 
          onClick={() => {
            const base = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4011';
            window.open(`${base}/api/osint/results/export?format=csv&q=${encodeURIComponent(q)}&type=${encodeURIComponent(type)}`, '_blank');
          }}
        >
          Export CSV
        </Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Value / URL / Email</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.slice(0, 200).map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.value || r.url || r.email}</TableCell>
                <TableCell>{r.site}</TableCell>
                <TableCell>{r.source}</TableCell>
                <TableCell>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}