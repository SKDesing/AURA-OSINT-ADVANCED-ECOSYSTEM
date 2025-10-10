import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  use: { 
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  reporter: [
    ['list'], 
    ['junit', { outputFile: 'reports/junit/playwright-junit.xml' }],
    ['html', { outputFolder: 'reports/playwright-html' }]
  ],
  projects: [
    { 
      name: 'Chromium', 
      use: { ...devices['Desktop Chrome'] } 
    },
    { 
      name: 'Firefox', 
      use: { ...devices['Desktop Firefox'] } 
    }
  ],
  webServer: [
    {
      command: 'pnpm run dev',
      port: 3000,
      reuseExistingServer: true,
      timeout: 30_000
    }
  ]
});