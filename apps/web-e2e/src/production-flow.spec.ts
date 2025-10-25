/**
 * @fileoverview End-to-end test for production deployment flow
 */

import { test, expect } from '@playwright/test';

test.describe('Production Flow Tests', () => {
  test('complete user journey from registration to plan generation', async ({
    page,
  }) => {
    // 1. Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to Alva');

    // 2. Email registration
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');

    // 3. Email verification (mock)
    await page.goto('/verify?token=mock-token');
    await expect(page.locator('h1')).toContainText(
      'Email verified successfully'
    );

    // 4. Complete onboarding
    await page.goto('/onboarding/welcome');
    await page.click("text=Let's Go");

    // Complete all onboarding cards
    for (let cardNumber = 1; cardNumber <= 26; cardNumber++) {
      await page.waitForURL(`/onboarding/${cardNumber}`);
      await page.waitForLoadState('networkidle');

      // Fill required fields based on card type
      const card = await page.locator('[data-testid="onboarding-card"]');
      if (await card.locator('input[type="text"]').isVisible()) {
        await card.locator('input[type="text"]').fill(`Test input ${i}`);
      }
      if (await card.locator('textarea').isVisible()) {
        await card.locator('textarea').fill(`Test description ${i}`);
      }
      if (await card.locator('[data-testid="pill-selector"]').isVisible()) {
        await card
          .locator('[data-testid="pill-selector"] button')
          .first()
          .click();
      }

      await page.click('text=Next');
    }

    // 5. Processing
    await expect(page.locator('h1')).toContainText('Crunching your answers');

    // 6. Summary
    await expect(page.locator('h1')).toContainText(
      'Your Marketing Plan is Ready'
    );

    // 7. Dashboard
    await page.click('text=View My Plan');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('error handling and edge cases', async ({ page }) => {
    // Test invalid email
    await page.goto('/');
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();

    // Test expired verification token
    await page.goto('/verify?token=expired-token');
    await expect(page.locator('h1')).toContainText('Verification failed');

    // Test network errors
    await page.route('**/api/**', (route) => route.abort());
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="error-boundary"]')).toBeVisible();
  });
});
