import { test, expect } from '@playwright/test';

// TODO: test.beforeEach that blocks tracking: await page.route('**/analytics/**', (route) => route.abort());

test('the page has its title and heading', async ({ page }) => {
  await page.goto('http://127.0.0.1:4891/');
  await expect(page).toHaveTitle('Blue Gum Landscaping');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blue Gum Landscaping');
});

// TODO: test('the menu opens and shows its links')
//   click the Menu button, expect aria-expanded to become "true", expect the Services link to be visible

// TODO: test('an empty form shows an error and no thank-you')
//   click "Send enquiry" with nothing typed, expect #error visible and #thanks hidden

// TODO: test('a filled form shows the thank-you and no error')
//   fill "Your name" and "Email", click "Send enquiry", expect #thanks visible and #error hidden
