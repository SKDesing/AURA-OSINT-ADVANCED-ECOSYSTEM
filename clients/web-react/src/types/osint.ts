export type ToolId = 'amass' | 'subfinder' | 'phoneinfoga' | 'maigret' | 'holehe';

export interface OsintToolDef {
  id: ToolId;
  name: string;
  description: string;
  category: 'Domain' | 'Phone' | 'Username' | 'Email';
  inputs: Array<
    | { name: 'domain'; label: string; type: 'text'; placeholder?: string; required?: boolean }
    | { name: 'email'; label: string; type: 'email'; placeholder?: string; required?: boolean }
    | { name: 'username'; label: string; type: 'text'; placeholder?: string; required?: boolean }
    | { name: 'phone'; label: string; type: 'tel'; placeholder?: string; required?: boolean }
  >;
  defaults?: Record<string, any>;
}

export interface OsintJob {
  id: string | number;
  jobId?: string | number;
  toolId: ToolId;
  params: Record<string, any>;
  status: 'queued' | 'active' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
  durationMs?: number;
}

export interface OsintResult {
  id?: string | number;
  jobId?: string | number;
  type: 'subdomain' | 'account' | 'email_usage' | string;
  value?: string;
  site?: string;
  url?: string;
  email?: string;
  status?: string;
  source?: string;
  createdAt?: string;
}