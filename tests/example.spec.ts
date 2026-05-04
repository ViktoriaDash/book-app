import { test, expect } from '@playwright/test';

const baseUrl = 'http://localhost:3000';

test.describe('Книжковий додаток - Е2Е тести', () => {

  test('успішно завантажувати головну сторінку', async ({ page }) => {
    await page.goto(baseUrl);
    
    const logo = page.locator('text=truelove');
    await expect(logo).toBeVisible();
  });

  test('переходить на сторінку паперових книг', async ({ page }) => {
    await page.goto(baseUrl);
    
    const articlesLink = page.getByRole('link', { name: /Паперові книги/i });
    await articlesLink.click();
    
    await expect(page).toHaveURL(`${baseUrl}/articles`);
  });

  test('пошуковий рядок  приймаэ введення тексту', async ({ page }) => {
    await page.goto(baseUrl);
    
    const searchInput = page.getByPlaceholder(/Пошук книг.../i);
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('Кобзар');
    await expect(searchInput).toHaveValue('Кобзар');
  });
});