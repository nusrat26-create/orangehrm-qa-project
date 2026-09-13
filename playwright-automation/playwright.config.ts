import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for OrangeHRM UI automation suite.
 * - Generates both the built-in HTML report and an Allure report on every run.
 * - Each spec file (tests/*.spec.ts) is independently runnable, and the
 *   whole folder runs sequentially in one suite via `npm test`.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // Run spec files one after another (not in parallel) so the suite behaves
  // predictably against the shared OrangeHRM demo environment/data.
  fullyParallel: false,
  workers: 1,
  retries: 1,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],

  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
