import { test, expect } from '@playwright/test';

test.describe('MVP Flow', () => {
  test('complete onboarding to dashboard flow', async ({ page }) => {
    // 1. Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText(
      'Your AI Marketing Assistant'
    );

    // 2. Email capture
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // 3. Welcome screen
    await expect(page.locator('h1')).toContainText('Welcome to Alva!');
    await page.click("text=Let's Go");

    // 4. Onboarding cards (test first few)
    await expect(page.locator('h1')).toContainText(
      "What's your business name?"
    );
    await page.fill(
      'input[placeholder="Enter your business name"]',
      'Test Business'
    );
    await page.click('text=Next');

    // 5. Processing screen
    await expect(page.locator('h1')).toContainText('Crunching your answers...');

    // 6. Summary preview
    await expect(page.locator('h1')).toContainText(
      'Your Marketing Plan is Ready!'
    );
  });

  test('dashboard loads correctly', async ({ page }) => {
    // Mock authentication and navigate to dashboard
    await page.goto('/dashboard');

    // Check dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Daily Quick Wins')).toBeVisible();
    await expect(page.locator('text=Plan Overview')).toBeVisible();
  });
});
