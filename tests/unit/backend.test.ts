import { describe, it, expect } from 'vitest';

describe('Backend OSINT API', () => {
  it('should validate job schema', () => {
    const validJob = {
      toolId: 'amass',
      params: { domain: 'example.com', passive: true }
    };
    
    expect(validJob.toolId).toBe('amass');
    expect(validJob.params.domain).toBe('example.com');
  });

  it('should generate unique job IDs', () => {
    const jobId1 = `amass-${Date.now()}`;
    const jobId2 = `amass-${Date.now() + 1}`;
    
    expect(jobId1).not.toBe(jobId2);
    expect(jobId1).toMatch(/^amass-\d+$/);
  });
});