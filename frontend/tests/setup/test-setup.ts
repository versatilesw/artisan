import { test as base, type Page } from '@playwright/test';

// Extend the base test type with custom fixtures
type TestFixtures = {
  mockApi: (page: Page) => Promise<void>;
};

// Create a test object with the custom fixtures
export const test = base.extend<TestFixtures>({
  mockApi: async ({ page }, use) => {
    const mockApi = async (page: Page) => {
      // Mock API responses
      await page.route('**/api/messages', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 1,
                content: 'Hello',
                sender: 'user',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              {
                id: 2,
                content: 'Hi there! How can I help you today?',
                sender: 'bot',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
          });
        } else if (route.request().method() === 'POST') {
          const requestBody = JSON.parse(await route.request().postData() || '{}');
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: Math.floor(Math.random() * 1000),
              content: requestBody.content,
              sender: requestBody.sender || 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          });
        }
      });

      // Mock message updates
      await page.route('**/api/messages/*', async (route) => {
        if (route.request().method() === 'PUT') {
          const requestBody = JSON.parse(await route.request().postData() || '{}');
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: parseInt(route.request().url().split('/').pop() || '0'),
              content: requestBody.content,
              sender: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          });
        } else if (route.request().method() === 'DELETE') {
          await route.fulfill({ status: 204 });
        }
      });

      // Mock regenerate endpoint
      await page.route('**/api/messages/regenerate/*', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: parseInt(route.request().url().split('/').pop() || '0'),
            content: 'Regenerated response',
            sender: 'bot',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        });
      });
    };

    await use(mockApi);
  }
});
