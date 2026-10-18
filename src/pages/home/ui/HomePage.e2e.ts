import { expect, test, type Page } from '@playwright/test'

const inDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10)

const dateField = (page: Page, name: 'Check-in' | 'Check-out') =>
  page.getByRole('textbox', { name, exact: true })

const searchStay = async (page: Page) => {
  await dateField(page, 'Check-in').fill(inDays(20))
  await dateField(page, 'Check-out').fill(inDays(22))
  await page.getByRole('button', { name: 'Check availability' }).click()
}

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem('pista-siete:locale', 'en')
        sessionStorage.setItem('seeded', '1')
      }
    })
    await page.goto('/')
  })

  test('lists rooms with rates for the searched stay', async ({ page }) => {
    await searchStay(page)

    const results = page.locator('#availability')
    await expect(results.getByRole('heading', { name: 'Rooms for your dates' })).toBeVisible()
    await expect(results.getByText(/2 nights, 2 guests/)).toBeVisible()
    await expect(results.getByRole('button', { name: 'Reserve' }).first()).toBeVisible()
    await expect(results.getByText(/Free cancellation until/).first()).toBeVisible()
  })

  test('explains an invalid stay', async ({ page }) => {
    const checkIn = await dateField(page, 'Check-in').inputValue()
    await dateField(page, 'Check-out').fill(checkIn)
    await page.getByRole('button', { name: 'Check availability' }).click()

    await expect(page.getByRole('alert')).toHaveText(/at least one night after check-in/)
  })

  test('asks for the age of each child', async ({ page }) => {
    await page.getByRole('button', { name: /^Guests:/ }).click()
    await page.getByRole('button', { name: 'Children +1' }).click()
    await page.getByRole('button', { name: 'Done' }).click()
    await page.getByRole('button', { name: 'Check availability' }).click()

    await expect(page.locator('.booking-sign__error')).toHaveText('Pick the age of each child.')
  })

  test('switches language and remembers it', async ({ page }) => {
    await page.getByRole('button', { name: /Language/ }).click()
    await page.getByText('Español').click()

    await expect(page.locator('h1')).toHaveText('Duerme a seis minutos de tu puerta de embarque')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })

  test('shows six rooms and expands to all of them', async ({ page }) => {
    const rooms = page.locator('#rooms article')
    await expect(rooms).toHaveCount(6)
    await page.getByRole('button', { name: /Show all \d+ rooms/ }).click()
    await expect(rooms).toHaveCount(7)
  })
})
