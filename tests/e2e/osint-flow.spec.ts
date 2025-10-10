import { test, expect } from '@playwright/test';

test.describe('OSINT Tools Flow', () => {
  test('should run Amass tool and display results', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to OSINT Tools tab
    await page.click('text=OSINT Tools');
    
    // Configure target domain
    await page.fill('input[label="Domain"]', 'example.com');
    
    // Run Amass tool
    await page.click('text=Amass >> .. >> button:has-text("Run Tool")');
    
    // Wait for job completion (mock or real)
    await expect(page.locator('text=Results')).toBeVisible({ timeout: 10000 });
    
    // Verify results are displayed
    const resultsSection = page.locator('[data-testid="osint-results"]');
    await expect(resultsSection).toBeVisible();
  });

  test('should be accessible via keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should reach OSINT Tools tab
    const osintTab = page.locator('text=OSINT Tools');
    await expect(osintTab).toBeFocused();
    
    // Enter to activate
    await page.keyboard.press('Enter');
    await expect(page.locator('text=Target Configuration')).toBeVisible();
  });
});