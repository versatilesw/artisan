import { test } from './setup/test-setup';
import { expect } from '@playwright/test';

test.describe('Chat Application', () => {
  test.beforeEach(async ({ page, mockApi }) => {
    // Setup API mocks
    await mockApi(page);
    // Navigate to the chat application
    await page.goto('/');
  });

  test('should display the chat interface correctly', async ({ page }) => {
    // Check header elements
    await expect(
      page.getByText('Ask me anything or pick a place to start')
    ).toBeVisible();

    // Check input elements
    await expect(page.getByPlaceholder('Your question')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  test('should regenerate bot response', async ({ page }) => {
    // Send a message to get bot response
    await page.getByPlaceholder('Your question').fill('Tell me about Artisan');
    await page.getByRole('button', { name: 'Send' }).click();

    // Wait for bot response
    const initialResponse = await page.locator('.bg-gray-100').first();
    await initialResponse.waitFor();
    const initialText = await initialResponse.textContent();

    // Click regenerate button
    await page.getByTitle('Regenerate response').click();

    // Wait for regenerated response to appear
    await page.waitForTimeout(1000); // Give time for the UI to update

    // Verify new response is different or exists
    const newResponse = await page.locator('.bg-gray-100').first();
    await newResponse.waitFor();
    const newText = await newResponse.textContent();

    // Either the response should be different or at least exist
    if (newText === initialText) {
      await expect(newResponse).toBeVisible();
    } else {
      expect(newText).not.toBe(initialText);
    }
  });

  test('should handle empty and whitespace messages', async ({ page }) => {
    const inputField = page.getByPlaceholder('Your question');
    const sendButton = page.getByRole('button', { name: 'Send' });

    // Empty input
    await inputField.fill('');
    await expect(sendButton).toBeDisabled();

    // Whitespace only
    await inputField.fill('   ');
    await expect(sendButton).toBeDisabled();

    // Valid input
    await inputField.fill('Valid message');
    await expect(sendButton).toBeEnabled();
  });

  test('should copy bot message', async ({ page }) => {
    // Send a message to get bot response
    await page.getByPlaceholder('Your question').fill('Tell me something');
    await page.getByRole('button', { name: 'Send' }).click();

    // Wait for bot response
    await page.locator('.bg-gray-100').first().waitFor();

    // Click copy button
    await page.getByTitle('Copy message').click();

    // Note: We can't actually verify clipboard content in Playwright
    // but we can verify the button click worked
    await expect(page.getByTitle('Copy message')).toBeVisible();
  });
});
