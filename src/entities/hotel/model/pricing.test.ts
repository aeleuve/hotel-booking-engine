import { describe, expect, it } from 'vitest'
import { cheapestRate, directPrice } from './pricing'
import { defaultStay } from './stay'
import type { Availability } from './types'

const eur = (amount: number) => ({ amount, currency: 'EUR' as const })

const availability = (totals: (number | null)[]): Availability => ({
  query: defaultStay('2026-10-15'),
  nights: 1,
  rates: totals.map((total, index) => ({
    vendor: `vendor-${index}`,
    nightly: total === null ? null : eur(total),
    total: total === null ? null : eur(total),
    tax: null,
  })),
})

describe('pricing', () => {
  it('picks the cheapest priced channel', () => {
    expect(cheapestRate(availability([140, null, 120]))?.vendor).toBe('vendor-2')
  })

  it('discounts the cheapest channel for direct bookings', () => {
    expect(directPrice(availability([140, 120.5]))).toEqual(eur(108.45))
  })

  it('returns null when no channel is priced', () => {
    expect(directPrice(availability([null, null]))).toBeNull()
  })
})
