import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:4002';

export default function () {
  // Test health endpoint
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    'health status is 200': (r) => r.status === 200,
    'health response time < 100ms': (r) => r.timings.duration < 100,
  });

  // Test OSINT search
  const searchPayload = {
    query: 'test_user',
    platforms: ['all']
  };
  
  const searchRes = http.post(`${BASE_URL}/api/v1/osint/search`, JSON.stringify(searchPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(searchRes, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 500ms': (r) => r.timings.duration < 500,
    'search returns results': (r) => JSON.parse(r.body).success === true,
  });

  sleep(1);
}