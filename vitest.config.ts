import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default', 'junit'],
    outputFile: 'reports/junit/vitest-junit.xml',
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: 'reports/coverage',
      reporter: ['text', 'lcov', 'html'],
      lines: 85,
      functions: 85,
      branches: 80,
      statements: 85,
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.test.{ts,js}',
        '**/*.config.{ts,js}',
        'scripts/**'
      ]
    },
    include: [
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/integration/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'ai/**/?(*.)+(test).[jt]s?(x)',
      'backend/**/?(*.)+(test).[jt]s?(x)',
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'reports/**',
      'tests/e2e/**',
      'playwright/**',
      'clients/**',
      'marketing/**',
      'ai/**/tests/**',
      'backend/node_modules/**',
      '**/node_modules/**',
    ],
  },
  resolve: {
    alias: {
      sharp: path.resolve(__dirname, 'tests/mocks/sharp.ts'),
    },
  },
});