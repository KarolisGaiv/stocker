import { test, expect } from '@playwright/test'

test('navigating to dashboard', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Stocky App' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Stocky App logo' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Profile' })).toBeVisible()
  await expect(page.getByText('Your Portfolio DetailsCurrent')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Trade' })).toBeVisible()
})

test('empty user portfolio shows 0 portfolio value and return', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByText('Current Value$')).toBeVisible()
  await expect(page.getByText('Total Return0%')).toBeVisible()

  // current value should be $0
  await expect(page.getByText('$')).toHaveText('$0')

  // portfolio return should be 0%
  await expect(page.getByText('%')).toHaveText('0%')
})

test('navigating to profile page', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Profile' }).click()
  await expect(page).toHaveURL('/balance')
  await expect(page.getByRole('heading', { name: 'Account Balance' })).toBeVisible()
  await expect(page.locator('[data-test="balance-display"]')).toHaveText('$0')
})

test('deposit money to balance', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Profile' }).click()
  await expect(page.locator('[data-test="balance-display"]')).toHaveText('$0')

  await page.getByPlaceholder('Enter amount').click()
  await page.getByPlaceholder('Enter amount').fill('6000')
  await page.getByRole('button', { name: 'Deposit' }).click()

  await expect(page.getByText('You have deposited $6000 succesfully ×')).toBeVisible()
  await expect(page.locator('[data-test="balance-display"]')).toHaveText('$6000')
})

test('withdraw money from balance', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Profile' }).click()
  await page.getByPlaceholder('Enter amount').click()
  await page.getByPlaceholder('Enter amount').fill('6000')
  await page.getByRole('button', { name: 'Deposit' }).click()

  await expect(page.locator('[data-test="balance-display"]')).toHaveText('$6000')
  await page.getByPlaceholder('Enter amount').click()
  await page.getByPlaceholder('Enter amount').fill('3000')
  await page.getByRole('button', { name: 'Withdraw' }).click()

  await expect(page.getByText('You have withdrawn $3000 succesfully ×')).toBeVisible()
  await expect(page.locator('[data-test="balance-display"]')).toHaveText('$3000')
})

test('withdraw more than currently is in balance', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'Profile' }).click()
  await page.getByPlaceholder('Enter amount').click()
  await page.getByPlaceholder('Enter amount').fill('6000')
  await page.getByRole('button', { name: 'Deposit' }).click()

  await page.getByPlaceholder('Enter amount').click()
  await page.getByPlaceholder('Enter amount').fill('189198198000')
  await page.getByRole('button', { name: 'Withdraw' }).click()
  await expect(page.getByText('Insufficient balance ×')).toBeVisible()
})
