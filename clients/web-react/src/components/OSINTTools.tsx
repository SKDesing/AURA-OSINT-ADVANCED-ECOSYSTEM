import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Chip, Alert, CircularProgress,
  List, ListItem, ListItemText, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { Search, Security, Phone, Web, Email } from '@mui/icons-material';
import { apiGet, apiPost } from '../api/client';
import { OsintToolDef, OsintResult, ToolId } from '../types/osint';

const BUILTIN_TOOLS: OsintToolDef[] = [
  { id: 'amass', name: 'Amass', description: 'Subdomain enumeration', category: 'Domain',
    inputs: [{ name: 'domain', label: 'Domain', type: 'text', placeholder: 'example.com', required: true }],
    defaults: { passive: true }
  },
  { id: 'subfinder', name: 'Subfinder', description: 'Fast subdomain discovery', category: 'Domain',
    inputs: [{ name: 'domain', label: 'Domain', type: 'text', placeholder: 'example.com', required: true }]
  },
  { id: 'phoneinfoga', name: 'PhoneInfoga', description: 'Phone number investigation', category: 'Phone',
    inputs: [{ name: 'phone', label: 'Phone', type: 'tel', placeholder: '+33123456789', required: true }]
  },
  { id: 'maigret', name: 'Sherlock', description: 'Username investigation (Sherlock)', category: 'Username',
    inputs: [{ name: 'username', label: 'Username', type: 'text', placeholder: 'johndoe', required: true }]
  },
  { id: 'holehe', name: 'Holehe', description: 'Email account finder', category: 'Email',
    inputs: [{ name: 'email', label: 'Email', type: 'email', placeholder: 'user@example.com', required: true }]
  }
];

const ICONS: Record<string, React.ReactNode> = {
  Domain: <Web />, Phone: <Phone />, Username: <Security />, Email: <Email />
};

const OSINTTools: React.FC = () => {
  const [tools, setTools] = useState<OsintToolDef[]>([]);
  const [category, setCategory] = useState<'All' | 'Domain' | 'Phone' | 'Username' | 'Email'>('All');
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<Record<ToolId, Record<string, any>>>({
    amass: { domain: 'example.com' }, subfinder: { domain: 'example.com' },
    phoneinfoga: { phone: '' }, maigret: { username: '' }, holehe: { email: '' }
  } as any);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<OsintResult[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<{ tools: any[] }>('/api/osint/tools');
        if (data?.tools?.length) {
          setTools(BUILTIN_TOOLS);
        } else {
          setTools(BUILTIN_TOOLS);
        }
      } catch {
        setTools(BUILTIN_TOOLS);
      }
    })();
  }, []);

  const filteredTools = useMemo(
    () => tools.filter(t => category === 'All' ? true : t.category === category),
    [tools, category]
  );

  const runTool = async (tool: OsintToolDef) => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...(tool.defaults || {}), ...(formState[tool.id] || {}) };
      
      // Use live OSINT endpoints
      let endpoint = '';
      let payload = {};
      
      if (tool.id === 'maigret') {
        endpoint = '/api/osint/live/sherlock';
        payload = { username: params.username || 'test' };
      } else if (tool.id === 'amass') {
        endpoint = '/api/osint/live/amass';
        payload = { domain: params.domain || 'example.com', passive: true };
      } else {
        // Fallback to mock for other tools
        const job = await apiPost<any>('/api/osint/jobs', { toolId: tool.id, params });
        setTimeout(async () => {
          try {
            const data = await apiGet<{ results: OsintResult[] }>('/api/osint/results');
            setResults(data.results || []);
          } catch {}
        }, 2000);
        return;
      }
      
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:4010';
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      
      if (data.results) {
        const osintResults: OsintResult[] = data.results.map((r: any) => ({
          type: r.site || r.subdomain || 'result',
          value: r.url || r.subdomain || r.site || 'N/A',
          source: data.tool,
          url: r.url,
          site: r.site
        }));
        setResults(osintResults);
      } else {
        setResults([]);
      }
      
    } catch (e: any) {
      setError(e?.message || 'Failed to run tool');
    } finally {
      setLoading(false);
    }
  };

  const onChangeField = (toolId: ToolId, name: string, value: any) => {
    setFormState((s) => ({ ...s, [toolId]: { ...(s[toolId] || {}), [name]: value } }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ color: '#fe2c55' }}>🔍 OSINT Tools</Typography>
        <ToggleButtonGroup value={category} exclusive onChange={(_, v) => v && setCategory(v)} size="small">
          <ToggleButton value="All">All</ToggleButton>
          <ToggleButton value="Domain">Domain</ToggleButton>
          <ToggleButton value="Username">Username</ToggleButton>
          <ToggleButton value="Email">Email</ToggleButton>
          <ToggleButton value="Phone">Phone</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {filteredTools.map((tool) => (
          <Box key={tool.id} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }}>
            <Card sx={{ bgcolor: '#161823', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {ICONS[tool.category] || <Search />}
                  <Typography variant="h6" sx={{ ml: 1 }}>{tool.name}</Typography>
                  <Chip label={tool.category} size="small" sx={{ ml: 'auto', bgcolor: '#25f4ee', color: '#000' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {tool.description}
                </Typography>

                {tool.inputs.map((inp) => (
                  <TextField
                    key={`${tool.id}-${inp.name}`}
                    fullWidth
                    label={inp.label}
                    type={inp.type}
                    value={(formState[tool.id] || {})[inp.name] || ''}
                    onChange={(e) => onChangeField(tool.id, inp.name, e.target.value)}
                    placeholder={inp.placeholder}
                    required={inp.required}
                    sx={{ mb: 2 }}
                  />
                ))}

                <Button
                  variant="contained" fullWidth disabled={loading}
                  onClick={() => runTool(tool)}
                  sx={{ bgcolor: '#fe2c55', '&:hover': { bgcolor: '#e02347' } }}
                >
                  {loading ? <CircularProgress size={20} /> : 'Run Tool'}
                </Button>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {results.length > 0 && (
        <Card sx={{ mt: 3, bgcolor: '#161823' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>📊 Results ({results.length})</Typography>
            <List>
              {results.slice(0, 20).map((r, i) => (
                <ListItem key={i}>
                  <ListItemText
                    primary={r.value || r.url || r.email || r.site}
                    secondary={`Type: ${r.type}${r.source ? ` | Source: ${r.source}` : ''}`}
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