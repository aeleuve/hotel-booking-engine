import { describe, expect, it } from 'vitest'
import { parseMakcorpsPrice, toVendorRates } from './makcorps-rows'

describe('makcorps rows', () => {
  it.each([
    ['€1,120', 1120],
    ['$98', 98],
    ['76.5', 76.5],
  ])('parses %s', (raw, amount) => {
    expect(parseMakcorpsPrice(raw)).toEqual({ amount, currency: 'EUR' })
  })

  it.each([null, '', 'N/A'])('treats %o as unpriced', (raw) => {
    expect(parseMakcorpsPrice(raw)).toBeNull()
  })

  it('maps indexed vendor cells to rates', () => {
    const rates = toVendorRates({
      comparison: [
        [
          { vendor1: 'Booking.com', price1: '€100', Totalprice1: '€220', tax1: '€20' },
          { vendor2: 'Expedia.com', price2: null, Totalprice2: null, tax2: null },
        ],
      ],
    })

    expect(rates).toEqual([
      {
        vendor: 'Booking.com',
        nightly: { amount: 100, currency: 'EUR' },
        total: { amount: 220, currency: 'EUR' },
        tax: { amount: 20, currency: 'EUR' },
      },
      { vendor: 'Expedia.com', nightly: null, total: null, tax: null },
    ])
  })

  it('handles an empty comparison', () => {
    expect(toVendorRates({ comparison: [] })).toEqual([])
  })
})
