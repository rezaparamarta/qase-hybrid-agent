import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

test(qase(3, 'Add a product to the cart'), async ({ page }) => {
  // Precondition: logged in as "standard_user", cart is empty (fresh browser context).
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SAUCE_PASSWORD ?? '');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);

  const backpack = page.getByTestId('inventory-item').filter({ hasText: 'Sauce Labs Backpack' });

  await test.step('On the Products page, click "Add to cart" on "Sauce Labs Backpack"', async () => {
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await expect(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  await test.step('Look at the cart icon in the header', async () => {
    await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  });

  await test.step('Click the cart icon', async () => {
    await page.getByTestId('shopping-cart-link').click();
    await expect(page).toHaveURL(/\/cart\.html$/);
    const items = page.getByTestId('inventory-item');
    await expect(items).toHaveCount(1);
    await expect(items.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
    await expect(items.getByTestId('item-quantity')).toHaveText('1');
  });
});
