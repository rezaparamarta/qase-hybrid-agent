import { test, expect, type Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

async function stepEvidence(page: Page, name: string) {
  qase.attach({ name: `${name}.png`, content: await page.screenshot(), contentType: 'image/png' });
}

// Known SauceDemo bug: problem_user sees the same image (/assets/sl-404-*.jpg) on every product.
// This spec is expected to stay red on step 2 until the app is fixed. CI excludes @known-bug.
test(qase(5, 'Product images match their products (problem_user)'), { tag: '@known-bug' }, async ({ page }) => {
  // Precondition: "user is logged out." A fresh browser context has no session.

  await test.step('Log in with username "problem_user" and the valid password', async () => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill('problem_user');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.SAUCE_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Login' }).click();
    // Expected result: Products page is shown.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await stepEvidence(page, 'step-1');
  });

  await test.step('Compare the image of each product on the Products page', async () => {
    const products = page.getByTestId('inventory-item');
    await expect(products).toHaveCount(6);
    await stepEvidence(page, 'step-2');

    // Expected result: every product shows its own distinct image (no two products share the same image).
    // Polls the products whose image src is also used by another product; must be none.
    await expect
      .poll(
        async () => {
          const rows = await products.evaluateAll((items) =>
            items.map((item) => ({
              name: item.querySelector('[data-test="inventory-item-name"]')?.textContent ?? '',
              src: item.querySelector('img')?.getAttribute('src') ?? '',
            })),
          );
          return rows
            .filter((row) => rows.some((other) => other !== row && other.src === row.src))
            .map((row) => `${row.name} -> ${row.src}`);
        },
        { message: 'products that share an image with another product' },
      )
      .toEqual([]);
  });
});
