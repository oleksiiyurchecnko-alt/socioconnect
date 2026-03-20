import { test, expect } from '@playwright/test';

test('has Admin title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Admin');
});

test('displays user and sum', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Admin User')).toBeVisible();
  await expect(page.locator('text=Sum: 5')).toBeVisible();
});

test('increment button works', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="sc-button"]');
  await expect(page.locator('text=Sum: 6')).toBeVisible();
});
