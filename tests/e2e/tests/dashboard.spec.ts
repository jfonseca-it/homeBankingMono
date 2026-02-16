import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should load the dashboard with accounts', async ({ page }) => {
    await page.goto('/');

    // Check for header
    await expect(page.getByRole('heading', { name: 'Home Banking' })).toBeVisible();

    // Check for accounts section
    await expect(page.getByRole('heading', { name: 'Your Accounts' })).toBeVisible();

    // Check that at least 3 account cards are present
    const accountCards = page.locator('.rounded-lg.border.bg-card').filter({ hasText: /USD/ });
    await expect(accountCards).toHaveCount(3);

    // Verify account holders are displayed
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();
    await expect(page.getByText('Bob Johnson')).toBeVisible();
  });

  test('should display the transfer form', async ({ page }) => {
    await page.goto('/');

    // Check for transfer form section
    await expect(page.getByRole('heading', { name: 'New Transfer' })).toBeVisible();

    // Verify form fields are present
    await expect(page.getByLabel('From Account')).toBeVisible();
    await expect(page.getByLabel('To Account')).toBeVisible();
    await expect(page.getByLabel('Amount')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transfer' })).toBeVisible();
  });
});
