import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('button', { name: 'Checker', exact: true }).click();

  await expect(page.locator('#checker-tool-card')).toBeVisible();
  await page.getByRole('button', { name: /Rs\. 750/ }).click();
});

test('shows the winning result for a single number', async ({ page }) => {
  await page.getByRole('textbox', { name: 'Enter 6-Digit Prize Bond' }).fill('308852');
  await page.getByRole('button', { name: 'Check Prize Bond' }).click();

  await expect(page.getByText('Prize Bond #308852', { exact: true })).toBeVisible();
});

test('shows winning numbers in a bulk list', async ({ page }) => {
  await page.getByRole('button', { name: 'Multiple / Bulk List' }).click();
  await page.getByRole('textbox', { name: /Enter Multiple Bond Numbers/ }).fill('308852\n308853');
  await page.getByRole('button', { name: 'Check All Numbers' }).click();

  await expect(page.getByText('Prize Bond #308852', { exact: true })).toBeVisible();
  await expect(page.getByText('2 Checked')).toBeVisible();
});

test('shows winning numbers in a series range', async ({ page }) => {
  await page.getByRole('button', { name: 'By Series Range' }).click();
  await page.getByRole('textbox', { name: 'Starting Serial Number (From)' }).fill('308851');
  await page.getByRole('textbox', { name: 'Ending Serial Number (To)' }).fill('308853');
  await page.getByRole('button', { name: 'Check Series Range' }).click();

  await expect(page.getByText('Prize Bond #308852', { exact: true })).toBeVisible();
  await expect(page.getByText('3 Checked')).toBeVisible();
});