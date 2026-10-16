import { describe, expect, it, vi } from 'vitest'
import type { HttpGet } from 'src/shared/api/http-client'
import { defaultStay } from '../model/stay'
import { createMakcorpsHotel } from './makcorps-hotel'

describe('makcorps hotel adapter', () => {
  it('requests /hotel with the stay and maps the comparison', async () => {
    const http = vi.fn(() =>
      Promise.resolve({
        comparison: [[{ vendor1: 'Booking.com', price1: '€90', Totalprice1: '€99', tax1: '€9' }]],
      }),
    ) as unknown as HttpGet
    const repository = createMakcorpsHotel(http, { apiKey: 'key', hotelId: '229689' })

    const availability = await repository.checkAvailability(defaultStay('2026-11-10'))

    expect(http).toHaveBeenCalledWith('/hotel', {
      hotelid: '229689',
      checkin: '2026-11-10',
      checkout: '2026-11-11',
      adults: 2,
      children: 0,
      rooms: 1,
      currency: 'EUR',
      api_key: 'key',
    })
    expect(availability.nights).toBe(1)
    expect(availability.rates[0]?.total).toEqual({ amount: 99, currency: 'EUR' })
  })
})
