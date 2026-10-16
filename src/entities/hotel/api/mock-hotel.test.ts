import { describe, expect, it } from 'vitest'
import { directPrice } from '../model/pricing'
import { createMockHotel } from './mock-hotel'

describe('mock hotel adapter', () => {
  const repository = createMockHotel({ latencyMs: 0 })

  it('prices every vendor for the whole stay', async () => {
    const availability = await repository.checkAvailability({
      checkIn: '2026-11-10',
      checkOut: '2026-11-12',
      adults: 2,
      children: 0,
      rooms: 1,
    })

    expect(availability.nights).toBe(2)
    expect(availability.rates).toHaveLength(4)
    expect(availability.rates.every(({ total }) => total !== null)).toBe(true)
    expect(directPrice(availability)).not.toBeNull()
  })

  it('makes weekend nights cheaper', async () => {
    const stay = { adults: 1, children: 0, rooms: 1 }
    const weekday = await repository.checkAvailability({
      ...stay,
      checkIn: '2026-11-11',
      checkOut: '2026-11-12',
    })
    const saturday = await repository.checkAvailability({
      ...stay,
      checkIn: '2026-11-14',
      checkOut: '2026-11-15',
    })

    expect(saturday.rates[0]!.nightly!.amount).toBeLessThan(weekday.rates[0]!.nightly!.amount)
  })
})
