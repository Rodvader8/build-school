import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Never add fake visitors to anyone's analytics, whatever URL a test ends up pointed at.
  await page.route('**/analytics/**', (route) => route.abort());
  await page.goto('/');
});

test('the page has its title and heading', async ({ page }) => {
  await expect(page).toHaveTitle('Blue Gum Landscaping');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blue Gum Landscaping');
});

test('the menu opens and shows its links', async ({ page }) => {
  const button = page.getByRole('button', { name: 'Menu' });
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('link', { name: 'Services' })).toBeVisible();
});

test('an empty form shows an error and no thank-you', async ({ page }) => {
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.locator('#error')).toBeVisible();
  await expect(page.locator('#thanks')).toBeHidden();
});

test('a filled form shows the thank-you and no error', async ({ page }) => {
  await page.getByLabel('Your name').fill('Sam Example');
  await page.getByLabel('Email').fill('sam@example.com');
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.locator('#thanks')).toBeVisible();
  await expect(page.locator('#error')).toBeHidden();
});
