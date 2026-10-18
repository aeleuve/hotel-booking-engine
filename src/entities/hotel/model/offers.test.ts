import { describe, expect, it } from 'vitest'
import { cheapestOffer, groupOffersByRoom } from './offers'
import type { RateOffer, RoomType } from './types'

const offer = (offerId: string, roomId: string | null, amount: number): RateOffer => ({
  offerId,
  roomId,
  name: `Supplier ${roomId}`,
  board: { code: 'RO', name: 'Room Only' },
  refundable: false,
  freeCancellationUntil: null,
  total: { amount, currency: 'EUR' },
  taxesIncluded: null,
  payAtHotel: null,
})

const room = (id: string): RoomType => ({
  id,
  name: `Room ${id}`,
  sizeM2: 20,
  maxGuests: 2,
  beds: [],
  photoUrls: [],
})

describe('offers', () => {
  const offers = [
    offer('a', '1', 300),
    offer('b', '2', 200),
    offer('c', '1', 250),
    offer('d', null, 400),
  ]

  it('finds the cheapest offer', () => {
    expect(cheapestOffer(offers)?.offerId).toBe('b')
    expect(cheapestOffer([])).toBeNull()
  })

  it('groups by room, cheapest room and offer first', () => {
    const groups = groupOffersByRoom(offers, [room('1'), room('2')])
    expect(groups.map((group) => group.room?.id ?? null)).toEqual(['2', '1', null])
    expect(groups[1]!.offers.map(({ offerId }) => offerId)).toEqual(['c', 'a'])
  })
})
