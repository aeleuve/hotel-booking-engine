import { expect, test } from '@playwright/test'

const inDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)

test('books a refundable room, then finds and cancels it', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pista-siete:locale', 'en'))
  await page.goto('/')

  await page.getByRole('textbox', { name: 'Check-in', exact: true }).fill(inDays(20))
  await page.getByRole('textbox', { name: 'Check-out', exact: true }).fill(inDays(22))
  await page.getByRole('button', { name: 'Check availability' }).click()

  const refundableRate = page
    .locator('.rate-row')
    .filter({ hasText: 'Free cancellation until' })
    .first()
  await refundableRate.getByRole('button', { name: 'Reserve' }).click()

  await expect(page).toHaveURL(/\/checkout$/)
  await page.getByLabel('First name').fill('Ana')
  await page.getByLabel('Last name').fill('Ruiz')
  await page.getByLabel('Email').fill('e2e-ana@example.test')
  await page.getByLabel('Phone').fill('+34 600 000 000')
  await page.getByRole('button', { name: 'Continue to payment' }).click()

  await page.getByRole('button', { name: 'Pay with test card' }).click()

  await expect(page.getByRole('heading', { name: 'Booking confirmed' })).toBeVisible()
  const bookingId = await page.locator('.complete__code').textContent()
  expect(bookingId).toMatch(/^MK/)

  await page.getByRole('link', { name: 'Manage this booking' }).click()
  await expect(page.getByText('Confirmed', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Cancel booking' }).click()
  await page.getByRole('button', { name: 'Yes, cancel' }).click()
  await expect(page.getByRole('status')).toHaveText(/Booking cancelled/)
  await expect(page.getByText('Cancelled', { exact: true })).toBeVisible()
})

test('sends visitors without a selected rate back to the search', async ({ page }) => {
  await page.goto('/checkout')
  await expect(page).toHaveURL(/\/#booking$/)
})
