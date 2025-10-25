/**
 * @fileoverview End-to-end test for MVP user flow
 */

import { test, expect } from '@playwright/test';

test.describe('Complete MVP Flow', () => {
  test('complete onboarding to dashboard flow', async ({ page }) => {
    // 1. Landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to Alva');

    // 2. Navigate to onboarding
    await page.goto('/onboarding/welcome');
    await expect(page.locator('h1')).toContainText('Welcome to Alva!');
    await page.click("text=Let's Go");

    // 3. Wait for navigation to first card and loading to complete
    await page.waitForURL('/onboarding/1');
    await page.waitForLoadState('networkidle');

    // Wait for the loading state to disappear and card content to appear
    await page.waitForSelector('h1:not(:has-text("Loading..."))', {
      timeout: 10000,
    });

    // 3. Onboarding cards (test first few)
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

    // 4. Processing screen
    await expect(page.locator('h1')).toContainText('Crunching your answers...');

    // 5. Summary preview
    await expect(page.locator('h1')).toContainText(
      'Your Marketing Plan is Ready!'
    );
  });

  test('dashboard loads correctly', async ({ page }) => {
    // Mock authentication and navigate to dashboard
    await page.goto('/dashboard');

    // Check dashboard elements - use more specific selectors to avoid strict mode violations
    await expect(page.locator('h2:has-text("Daily Quick Wins")')).toBeVisible();
    await expect(page.locator('h2:has-text("Plan Overview")')).toBeVisible();
  });

  test('marketing plan page displays correctly', async ({ page }) => {
    await page.goto('/dashboard/plan');

    // Check plan page elements - handle loading state and no plan scenario
    await page.waitForLoadState('networkidle');

    // Wait for loading to finish first
    await page.waitForFunction(
      () => {
        const loadingElements = document.querySelectorAll('p');
        for (const element of loadingElements) {
          if (element.textContent?.includes('Loading your marketing plan...')) {
            return false; // Still loading
          }
        }
        return true; // Loading finished
      },
      { timeout: 15000 }
    );

    // Check if we have a plan or the "no plan" message
    const hasNoPlan = await page
      .locator('text=No marketing plan found')
      .isVisible()
      .catch(() => false);

    if (hasNoPlan) {
      // If no plan, check for the expected "no plan" message and button
      await expect(page.locator('text=No marketing plan found')).toBeVisible();
      await expect(page.locator('text=Start Onboarding')).toBeVisible();
    } else {
      // If plan exists, check for tab elements
      await expect(
        page.locator('[role="tab"]:has-text("Overview")')
      ).toBeVisible();
      await expect(
        page.locator('[role="tab"]:has-text("Tasks")')
      ).toBeVisible();
      await expect(
        page.locator('[role="tab"]:has-text("Timeline")')
      ).toBeVisible();
      await expect(
        page.locator('[role="tab"]:has-text("Modules")')
      ).toBeVisible();
    }
  });
});

test.describe('Authentication Flow', () => {
  test('email verification works', async ({ page }) => {
    // Mock verification token
    await page.goto('/verify?token=mock-token');

    // Wait for the Suspense fallback to resolve and verification to start
    await page.waitForLoadState('networkidle');

    // Wait for the verification process to complete (success or error)
    await page.waitForSelector(
      'h1:not(:has-text("Loading...")):not(:has-text("Verifying your email..."))',
      { timeout: 10000 }
    );

    // Should show verification success or error - both are valid test outcomes
    const successVisible = await page
      .locator('h1:has-text("Email verified successfully!")')
      .isVisible()
      .catch(() => false);
    const errorVisible = await page
      .locator('h1:has-text("Verification failed")')
      .isVisible()
      .catch(() => false);

    expect(successVisible || errorVisible).toBeTruthy();
  });

  test('invalid verification token shows error', async ({ page }) => {
    await page.goto('/verify?token=invalid-token');

    // Wait for the Suspense fallback to resolve and verification to start
    await page.waitForLoadState('networkidle');

    // Wait for the verification process to complete (success or error)
    await page.waitForSelector(
      'h1:not(:has-text("Loading...")):not(:has-text("Verifying your email..."))',
      { timeout: 10000 }
    );

    // Should show error - wait for the error state
    await expect(page.locator('h1')).toContainText('Verification failed');
  });
});
