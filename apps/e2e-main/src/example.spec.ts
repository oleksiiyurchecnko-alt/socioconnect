import { test, expect } from '@playwright/test';

test('has Main title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Main');
});

test('displays user and sum', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Main User')).toBeVisible();
  await expect(page.locator('text=Sum: 15')).toBeVisible();
});

test('increment button works', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="sc-button"]');
  await expect(page.locator('text=Sum: 16')).toBeVisible();
});
