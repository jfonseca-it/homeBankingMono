import { test, expect } from '@playwright/test';

test.describe('Transfer Flow', () => {
  test('should complete a successful transfer', async ({ page }) => {
    await page.goto('/');

    // Fill in the transfer form
    await page.getByLabel('From Account').selectOption({ index: 1 }); // Select first account
    await page.getByLabel('To Account').selectOption({ index: 2 }); // Select second account
    await page.getByLabel('Amount').fill('50.00');
    await page.getByLabel('Description').fill('Test E2E Transfer');

    // Submit the transfer
    await page.getByRole('button', { name: 'Transfer' }).click();

    // Wait for success message
    await expect(page.getByText('Transfer completed successfully!')).toBeVisible({
      timeout: 10000,
    });

    // Wait for data to reload
    await page.waitForResponse(response => 
      response.url().includes('/api/accounts') && response.status() === 200
    );
    
    // Verify new transaction appears in the table
    await expect(page.locator('table tbody').getByText('Transfer')).toBeVisible();
  });

  test('should show validation error for same account transfer', async ({ page }) => {
    await page.goto('/');

    // Fill in the transfer form with same account
    await page.getByLabel('From Account').selectOption({ index: 1 });
    await page.getByLabel('To Account').selectOption({ index: 1 }); // Same account
    await page.getByLabel('Amount').fill('50.00');
    await page.getByLabel('Description').fill('Invalid Transfer');

    // Submit the transfer
    await page.getByRole('button', { name: 'Transfer' }).click();

    // Wait for error message
    await expect(page.getByText('Cannot transfer to the same account')).toBeVisible();
  });

  test('should show validation error for insufficient funds', async ({ page }) => {
    await page.goto('/');

    // Wait for accounts to load
    await page.waitForSelector('select#from-account option:nth-child(2)');

    // Fill in the transfer form with large amount
    await page.getByLabel('From Account').selectOption({ index: 1 });
    await page.getByLabel('To Account').selectOption({ index: 2 });
    await page.getByLabel('Amount').fill('999999.00');
    await page.getByLabel('Description').fill('Large Transfer');

    // Submit the transfer
    await page.getByRole('button', { name: 'Transfer' }).click();

    // Wait for error message
    await expect(page.getByText('Insufficient funds')).toBeVisible();
  });

  test('should show validation error for empty description', async ({ page }) => {
    await page.goto('/');

    // Fill in the transfer form without description
    await page.getByLabel('From Account').selectOption({ index: 1 });
    await page.getByLabel('To Account').selectOption({ index: 2 });
    await page.getByLabel('Amount').fill('50.00');
    // Leave description empty

    // Submit the transfer
    await page.getByRole('button', { name: 'Transfer' }).click();

    // Wait for error message
    await expect(page.getByText('Please enter a description')).toBeVisible();
  });

  test('should show validation error for invalid amount', async ({ page }) => {
    await page.goto('/');

    // Fill in the transfer form with invalid amount
    await page.getByLabel('From Account').selectOption({ index: 1 });
    await page.getByLabel('To Account').selectOption({ index: 2 });
    await page.getByLabel('Amount').fill('0');
    await page.getByLabel('Description').fill('Invalid Amount');

    // Submit the transfer
    await page.getByRole('button', { name: 'Transfer' }).click();

    // Wait for error message
    await expect(page.getByText(/Please enter a valid amount/)).toBeVisible();
  });
});
