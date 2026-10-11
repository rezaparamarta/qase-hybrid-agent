import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

// Known SauceDemo bug: problem_user sees the same image on every product.
// This spec is expected to stay red until the app is fixed.
test(qase(5, 'Product images match their products (problem_user)'), async ({ page }) => {
  // Precondition: user is logged out (fresh browser context).

  await test.step('Log in with username "problem_user" and the valid password', async () => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill('problem_user');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SAUCE_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  await test.step('Compare the image of each product on the Products page', async () => {
    const images = page.getByTestId('inventory-item').getByRole('img');
    await expect(images).toHaveCount(6);
    // Expected result: every product shows its own distinct image.
    await expect
      .poll(async () => {
        const srcs = await images.evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));
        return new Set(srcs).size;
      }, { message: 'number of distinct product image sources' })
      .toBe(6);
  });
});
