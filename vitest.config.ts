import { defineConfig } from 'vitest/config';

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
    }
  }
});