import { test, expect } from '@playwright/test';

test.describe('Basic Application Flow', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Welcome to Alva');
    await expect(
      page.locator('text=Your AI-powered marketing assistant')
    ).toBeVisible();
  });

  test('onboarding welcome page loads', async ({ page }) => {
    await page.goto('/onboarding/welcome');
    await expect(page.locator('h1')).toContainText('Welcome to Alva!');
    await expect(page.locator("text=Let's Go")).toBeVisible();
  });

  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');

    // Check dashboard elements - use more specific selectors to avoid strict mode violations
    await expect(page.locator('h2:has-text("Daily Quick Wins")')).toBeVisible();
    await expect(page.locator('h2:has-text("Plan Overview")')).toBeVisible();
  });

  test('marketing plan page loads', async ({ page }) => {
    await page.goto('/dashboard/plan');

    // Wait for the loading state to finish - wait for loading text to disappear
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

    // Now check what's actually on the page
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

  test('onboarding processing page loads', async ({ page }) => {
    await page.goto('/onboarding/processing');
    await expect(page.locator('h1')).toContainText('Crunching your answers...');
  });

  test('onboarding summary page loads', async ({ page }) => {
    await page.goto('/onboarding/summary');
    await expect(page.locator('h1')).toContainText(
      'Your Marketing Plan is Ready!'
    );
  });
});
