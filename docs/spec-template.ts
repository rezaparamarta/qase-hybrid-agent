/**
 * TEMPLATE for generated specs. Not executed (lives outside tests/).
 * Copy into tests/generated/<PROJECT>-<CASE_ID>-<kebab-title>.spec.ts and replace placeholders.
 *
 * Example below = SDEMO case "Login with valid credentials".
 */
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test(qase(1, 'Login with valid credentials'), async ({ page }) => {
  // One test.step per Qase step. Step text = Qase step text, verbatim.

  await test.step('Open the login page', async () => {
    await page.goto('/');
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  await test.step('Enter username "standard_user" and the valid password', async () => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill(process.env.SAUCE_PASSWORD ?? '');
  });

  await test.step('Click the Login button', async () => {
    await page.getByTestId('login-button').click();
    // Expected result: user lands on the inventory page and sees "Products".
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });
});
