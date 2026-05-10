import { test, expect } from '@playwright/test';

test('головна сторінка завантажується', async ({ page }) => {
  await page.goto('http://localhost:3000'); 
  await expect(page).toHaveTitle(/book-app/i);
});