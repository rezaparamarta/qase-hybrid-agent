import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test(qase(1, 'Login with valid credentials'), async ({ page }) => {
  // Precondition: user is logged out (fresh browser context).

  await test.step('Open the login page', async () => {
    await page.goto('/');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  await test.step('Enter username "standard_user" and the valid password', async () => {
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SAUCE_PASSWORD ?? '');
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('standard_user');
    await expect(page.getByRole('textbox', { name: 'Password' })).not.toHaveValue('');
  });

  await test.step('Click the Login button', async () => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });
});
