import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

/**
 * QASE_MODE:
 *   off      -> run locally, nothing is sent to Qase (default)
 *   testops  -> results are sent to a new Qase test run (npm run test:qase)
 */
const qaseMode = process.env.QASE_MODE ?? 'off';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined, // full parallelism exhausted browser resources (SDEMO-4)

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    // SauceDemo uses data-test="..." attributes, so getByTestId() reads those.
    testIdAttribute: 'data-test',
    screenshot: 'on', // every result carries a screenshot as evidence
    trace: 'retain-on-failure',
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'playwright-qase-reporter',
      {
        mode: qaseMode,
        debug: false,
        testops: {
          api: { token: process.env.QASE_API_TOKEN },
          project: process.env.QASE_PROJECT,
          uploadAttachments: true,
          run: {
            title: `[Regression] Playwright ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
            complete: true,
          },
        },
      },
    ],
  ],

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
