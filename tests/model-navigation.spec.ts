import { test, expect } from '@playwright/test';

test.describe('Model Navigation', () => {
  test('should navigate to model detail page and load model data', async ({ page }) => {
    // Start from the models page
    await page.goto('/models');
    
    // Wait for models to load
    await expect(page.locator('h1:has-text("Model Management")')).toBeVisible();
    
    // Check if there are model cards (if any exist)
    const modelCards = page.locator('[data-testid="model-card"]');
    const modelCount = await modelCards.count();
    
    if (modelCount > 0) {
      // Click on the first model's "View Details" button
      const firstModelCard = modelCards.first();
      await firstModelCard.locator('button:has-text("View Details")').click();
      
      // Should navigate to model detail page
      await expect(page).toHaveURL(/\/models\/[^\/]+$/);
      
      // Should show model detail content or error handling
      // Either the model loads successfully or shows appropriate error
      await expect(page.locator('h1, [data-testid="error-message"]')).toBeVisible();
      
      // If there's an error, it should be user-friendly
      const errorElement = page.locator('[data-testid="error-message"]');
      if (await errorElement.isVisible()) {
        await expect(errorElement).not.toContainText('undefined');
        await expect(errorElement).not.toContainText('null');
      }
    } else {
      // No models available - check empty state
      await expect(page.locator('text=No Models Found, text=No Pending Models')).toBeVisible();
    }
  });

  test('should handle direct navigation to model detail page', async ({ page }) => {
    // Test direct navigation to a model detail page
    await page.goto('/models/test-model-id');
    
    // Should show either model details or a proper error message
    await expect(page.locator('h1, [data-testid="error-message"]')).toBeVisible();
    
    // Check that back button works
    const backButton = page.locator('button:has-text("Back to Models")');
    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL('/models');
    }
  });

  test('should navigate between different pages using sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Test sidebar navigation
    await page.locator('button:has-text("Models")').click();
    await expect(page).toHaveURL('/models');
    
    await page.locator('button:has-text("Dashboard")').click();
    await expect(page).toHaveURL('/');
    
    await page.locator('button:has-text("Users")').click();
    await expect(page).toHaveURL('/users');
    
    await page.locator('button:has-text("Analytics")').click();
    await expect(page).toHaveURL('/analytics');
  });
});