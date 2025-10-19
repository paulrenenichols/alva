import { test, expect } from '@playwright/test';

test.describe('Complete MVP Flow', () => {
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

    await expect(page.locator('h1')).toContainText(
      'How would you describe your business?'
    );
    await page.fill('textarea', 'A test business description');
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

  test('marketing plan page displays correctly', async ({ page }) => {
    await page.goto('/dashboard/plan');

    // Check plan page elements
    await expect(page.locator('h1')).toContainText('Your Marketing Plan');
    await expect(page.locator('text=Overview')).toBeVisible();
    await expect(page.locator('text=Tasks')).toBeVisible();
    await expect(page.locator('text=Timeline')).toBeVisible();
    await expect(page.locator('text=Modules')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('email verification works', async ({ page }) => {
    // Mock verification token
    await page.goto('/verify?token=mock-token');

    // Should show verification success
    await expect(page.locator('h1')).toContainText(
      'Email verified successfully!'
    );
  });

  test('invalid verification token shows error', async ({ page }) => {
    await page.goto('/verify?token=invalid-token');

    // Should show error
    await expect(page.locator('h1')).toContainText('Verification failed');
  });
});
