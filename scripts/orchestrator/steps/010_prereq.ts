import { Step } from '../types';
import fs from 'fs';
import { execSync } from 'child_process';

export const prereqStep: Step = {
  id: '010_prereq',
  title: 'Prerequisites Check',
  description: 'Verify system prerequisites and basic structure',
  order: 10,
  
  verify: async () => {
    const checks = [
      { name: 'Node.js', cmd: 'node --version', required: true },
      { name: 'npm', cmd: 'npm --version', required: true },
      { name: 'Git', cmd: 'git --version', required: true },
      { name: 'PostgreSQL', cmd: 'psql --version', required: false },
      { name: 'Redis', cmd: 'redis-cli --version', required: false }
    ];
    
    const results = [];
    
    for (const check of checks) {
      try {
        const version = execSync(check.cmd, { encoding: 'utf8' }).trim();
        results.push(`✅ ${check.name}: ${version}`);
      } catch (error) {
        if (check.required) {
          return { success: false, message: `❌ Missing required: ${check.name}` };
        }
        results.push(`⚠️  Optional missing: ${check.name}`);
      }
    }
    
    // Check basic directories
    const requiredDirs = ['backend', 'scripts', 'docs'];
    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir)) {
        return { success: false, message: `❌ Missing directory: ${dir}` };
      }
    }
    
    return { success: true, message: `Prerequisites OK\n${results.join('\n')}` };
  },
  
  run: async () => {
    // Prerequisites are system-level, nothing to "run"
    return { success: true, message: 'Prerequisites verified' };
  }
};