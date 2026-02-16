import { test, expect } from '@playwright/test';

test.describe('Transaction List', () => {
  test('should display transactions table', async ({ page }) => {
    await page.goto('/');

    // Check for transactions section
    await expect(page.getByRole('heading', { name: 'Recent Transactions' })).toBeVisible();

    // Check table headers
    await expect(page.getByRole('cell', { name: 'Date' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Category' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Type' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Amount' })).toBeVisible();
  });

  test('should show transaction categories as badges', async ({ page }) => {
    await page.goto('/');

    // Wait for transactions to load
    await page.waitForSelector('table tbody tr');

    // Check for category badges
    const badges = page.locator('.inline-flex.items-center.rounded-full');
    await expect(badges.first()).toBeVisible();

    // Verify at least some transactions are displayed
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display transaction types with colors', async ({ page }) => {
    await page.goto('/');

    // Wait for transactions to load
    await page.waitForSelector('table tbody tr');

    // Check for Credit and Debit labels
    const cells = page.locator('table tbody tr td');
    const cellTexts = await cells.allTextContents();
    
    const hasCredit = cellTexts.some(text => text.includes('Credit'));
    const hasDebit = cellTexts.some(text => text.includes('Debit'));
    
    expect(hasCredit || hasDebit).toBeTruthy();
  });
});
