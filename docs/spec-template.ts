/**
 * TEMPLATE for generated specs. Not executed (lives outside tests/).
 * Copy into tests/generated/<PROJECT>-<CASE_ID>-<kebab-title>.spec.ts and replace placeholders.
 *
 * Every test.step with an expected result ends with stepEvidence() so the screenshot lands on
 * that step in Qase (never on the result as a whole).
 *
 * Example below = SDEMO case "Login with valid credentials".
 */
import { test, expect, type Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

async function stepEvidence(page: Page, name: string) {
  qase.attach({ name: `${name}.png`, content: await page.screenshot(), contentType: 'image/png' });
}

test(qase(1, 'Login with valid credentials'), async ({ page }) => {
  // One test.step per Qase step. Step text = Qase step text, verbatim.

  await test.step('Open the login page', async () => {
    await page.goto('/');
    await expect(page.getByTestId('login-button')).toBeVisible();
    await stepEvidence(page, 'step-1');
  });

  await test.step('Enter username "standard_user" and the valid password', async () => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill(process.env.SAUCE_PASSWORD ?? '');
    await stepEvidence(page, 'step-2');
  });

  await test.step('Click the Login button', async () => {
    await page.getByTestId('login-button').click();
    // Expected result: user lands on the inventory page and sees "Products".
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await stepEvidence(page, 'step-3');
  });
});
