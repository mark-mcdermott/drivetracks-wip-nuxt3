// home.spec.ts
import { test, expect } from '@playwright/test';
import { compareScreenshot, verifyHeaderDetails, verifyFooterDetails } from './shared';

test('Header details', async ({ page }) => {
  await page.goto('/');
  await verifyHeaderDetails(page, expect);
});

test('Homepage body text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'There was a wall.' })).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('hero-h1').filter({ hasText: 'It did not look important.' })).toBeVisible();
  await expect(page.getByTestId('hero-p').filter({ hasText: '{"status":"OK"}' })).toBeVisible();
  await expect(page.getByTestId('hero-link-login').filter({ hasText: 'Log in' })).toBeVisible();
});

test('Footer details', async ({ page }) => {
  await page.goto('/');
  await verifyFooterDetails(page, expect);
});

test('current screenshot matches baseline', async ({ page, browserName }) => {
  const pixelDiffCount = await compareScreenshot(page, 'home', { browserName, targetUrl: '/' })
  expect(pixelDiffCount).toBe(0)
})