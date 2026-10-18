import { describe, expect, it } from 'vitest'
import { bestStayPrice, flexibleStayRanges } from './flexible-stay'
import type { Availability, RateOffer, RoomType } from './types'

const offer = (amount: number, extra: Partial<RateOffer> = {}): RateOffer => ({
  offerId: `o-${amount}`,
  roomId: 'std',
  name: 'Standard Double',
  board: { code: 'RO', name: 'Room only' },
  refundable: false,
  freeCancellationUntil: null,
  total: { amount, currency: 'EUR' },
  taxesIncluded: null,
  payAtHotel: null,
  ...extra,
})
const availability = (offers: RateOffer[]): Availability => ({
  query: { checkIn: '2026-11-06', checkOut: '2026-11-08', adults: 2, childrenAges: [], rooms: 1 },
  nights: 2,
  offers,
})
const rooms: RoomType[] = [
  { id: 'std', name: 'Standard Double', sizeM2: 22, maxGuests: 2, beds: [], photoUrls: [] },
  { id: 'jr', name: 'Junior Suite', sizeM2: 45, maxGuests: 4, beds: [], photoUrls: [] },
]

describe('flexibleStayRanges', () => {
  it('lists every Friday→Sunday inside the month', () => {
    expect(
      flexibleStayRanges({ month: '2026-11', nights: 2, checkInDay: 'friday' }, '2026-10-18'),
    ).toEqual([
      { checkIn: '2026-11-06', checkOut: '2026-11-08' },
      { checkIn: '2026-11-13', checkOut: '2026-11-15' },
      { checkIn: '2026-11-20', checkOut: '2026-11-22' },
      { checkIn: '2026-11-27', checkOut: '2026-11-29' },
    ])
  })

  it('lists every check-in whose whole stay fits in the month', () => {
    const ranges = flexibleStayRanges(
      { month: '2026-11', nights: 3, checkInDay: null },
      '2026-10-18',
    )
    expect(ranges).toHaveLength(27)
    expect(ranges.at(-1)).toEqual({ checkIn: '2026-11-27', checkOut: '2026-11-30' })
  })

  it('never starts before today in the current month', () => {
    expect(
      flexibleStayRanges({ month: '2026-10', nights: 3, checkInDay: null }, '2026-10-18')[0],
    ).toEqual({ checkIn: '2026-10-18', checkOut: '2026-10-21' })
    expect(
      flexibleStayRanges({ month: '2026-10', nights: 2, checkInDay: 'friday' }, '2026-10-24'),
    ).toEqual([])
  })
})

describe('bestStayPrice', () => {
  it('takes the lowest total including what is paid at the hotel', () => {
    const price = bestStayPrice(
      availability([offer(140, { payAtHotel: { amount: 20, currency: 'EUR' } }), offer(150)]),
      rooms,
    )
    expect(price).toEqual({ amount: 150, currency: 'EUR' })
  })

  it('ignores a pay-at-hotel fee in another currency', () => {
    expect(
      bestStayPrice(
        availability([offer(140, { payAtHotel: { amount: 20, currency: 'USD' } })]),
        rooms,
      ),
    ).toEqual({ amount: 140, currency: 'EUR' })
  })

  it('only counts the requested room type, matched on room or offer name', () => {
    const offers = [offer(100), offer(180, { offerId: 'jr', roomId: 'jr', name: 'JS flexible' })]
    expect(bestStayPrice(availability(offers), rooms, 'suite')).toEqual({
      amount: 180,
      currency: 'EUR',
    })
    expect(bestStayPrice(availability(offers), rooms, 'penthouse')).toBeNull()
  })

  it('returns null without offers', () => {
    expect(bestStayPrice(availability([]), rooms)).toBeNull()
  })
})
