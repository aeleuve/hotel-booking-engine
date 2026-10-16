import { expect, test } from '@playwright/test'

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

  test('shows our price and other channels for the default stay', async ({ page }) => {
    await page.getByRole('button', { name: 'Check availability' }).click()

    await expect(page.getByText('Our price for your stay')).toBeVisible()
    await expect(page.getByRole('link', { name: /Request this price by email/ })).toHaveAttribute(
      'href',
      /^mailto:/,
    )
    await expect(page.getByText('Booking.com')).toBeVisible()
  })

  test('explains an invalid stay', async ({ page }) => {
    const checkIn = await page.getByRole('textbox', { name: 'Check-in', exact: true }).inputValue()
    await page.getByRole('textbox', { name: 'Check-out', exact: true }).fill(checkIn)
    await page.getByRole('button', { name: 'Check availability' }).click()

    await expect(page.getByRole('alert')).toHaveText(/at least one night after check-in/)
  })

  test('switches language and remembers it', async ({ page }) => {
    await page.getByRole('button', { name: /Language/ }).click()
    await page
      .getByRole('menuitem', { name: 'Español' })
      .or(page.getByText('Español'))
      .first()
      .click()

    await expect(page.locator('h1')).toHaveText('Duerme a seis minutos de tu puerta de embarque')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  })

  test('lists the three room types', async ({ page }) => {
    const rooms = page.locator('#rooms article')
    await expect(rooms).toHaveCount(3)
  })
})
