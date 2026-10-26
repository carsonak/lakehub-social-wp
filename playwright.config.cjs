const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './scripts/tests/browser',
  timeout: 90000,
  expect: { timeout: 10000 },
  workers: 1,
  retries: 0,
  outputDir: '.runtime/test-results',
  reporter: [['list'], ['json', { outputFile: '.runtime/interaction-recovery/results.json' }]],
  use: {
    baseURL: process.env.LAKEHUB_TEST_URL || 'http://localhost:8881',
    browserName: 'chromium',
    channel: process.env.LAKEHUB_BROWSER_CHANNEL || 'chromium',
    launchOptions: { args: ['--no-proxy-server', '--host-resolver-rules=MAP localhost 127.0.0.1'] },
    navigationTimeout: 60000,
    viewport: { width: 1280, height: 900 },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
