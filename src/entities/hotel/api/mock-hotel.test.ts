import { describe, expect, it } from 'vitest'
import { groupOffersByRoom } from '../model/offers'
import { createMockHotel } from './mock-hotel'

describe('mock hotel adapter', () => {
  const repository = createMockHotel({ latencyMs: 0 })
  const stay = {
    checkIn: '2026-11-10',
    checkOut: '2026-11-12',
    adults: 2,
    childrenAges: [],
    rooms: 1,
  }

  it('offers every board and policy for rooms that fit', async () => {
    const [availability, rooms] = await Promise.all([
      repository.checkAvailability(stay),
      repository.listRooms(),
    ])

    expect(availability.nights).toBe(2)
    const groups = groupOffersByRoom(availability.offers, rooms)
    expect(groups.every(({ room }) => room !== null)).toBe(true)
    expect(groups[0]!.offers).toHaveLength(4)
  })

  it('leaves out rooms too small for the party', async () => {
    const family = await repository.checkAvailability({ ...stay, adults: 3, childrenAges: [4] })
    const rooms = await repository.listRooms()
    const roomIds = new Set(family.offers.map(({ roomId }) => roomId))
    rooms
      .filter((room) => roomIds.has(room.id))
      .forEach((room) => expect(room.maxGuests).toBeGreaterThanOrEqual(4))
  })
})
