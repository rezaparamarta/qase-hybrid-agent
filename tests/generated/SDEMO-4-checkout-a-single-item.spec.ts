import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test(qase(4, 'Checkout a single item'), async ({ page }) => {
  // Precondition: logged in as "standard_user", "Sauce Labs Backpack" is in the cart.
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SAUCE_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  await test.step('Open the cart and click "Checkout"', async () => {
    await page.getByTestId('shopping-cart-link').click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Your Information');
  });

  await test.step('Fill First Name "Reza", Last Name "Tester", Postal Code "12190" and click "Continue"', async () => {
    await page.getByRole('textbox', { name: 'First Name' }).fill('Reza');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Tester');
    await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12190');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByTestId('title')).toHaveText('Checkout: Overview');
    await expect(page.getByTestId('inventory-item-name')).toHaveText(['Sauce Labs Backpack']);
    await expect(page.getByTestId('subtotal-label')).toHaveText('Item total: $29.99');
  });

  await test.step('Click "Finish"', async () => {
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  });
});
