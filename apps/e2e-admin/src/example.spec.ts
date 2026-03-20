import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('dashboard').waitFor({ state: 'visible', timeout: 15000 });
});

test('has Admin title', async ({ page }) => {
  await expect(page.getByTestId('dashboard-title')).toContainText(/admin/i);
});

test('displays admin page content', async ({ page }) => {
  await expect(page.getByTestId('dashboard')).toBeVisible();
});

test('increment button works', async ({ page }) => {
  const incrementSection = page.getByTestId('dashboard-increment');
  await incrementSection.getByTestId('sc-button').click();
  await expect(page.getByTestId('dashboard-sum')).toContainText('6');
});
