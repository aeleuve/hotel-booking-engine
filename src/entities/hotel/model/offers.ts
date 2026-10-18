import type { RateOffer, RoomType } from './types'

export interface RoomAvailability {
  room: RoomType | null
  /** Cheapest first. */
  offers: RateOffer[]
}

const byTotal = (a: RateOffer, b: RateOffer) => a.total.amount - b.total.amount

export const cheapestOffer = (offers: RateOffer[]): RateOffer | null =>
  offers.toSorted(byTotal)[0] ?? null

/**
 * Groups offers under the room type they map to, cheapest room first.
 * Offers without a known room are grouped by their supplier name.
 */
export const groupOffersByRoom = (offers: RateOffer[], rooms: RoomType[]): RoomAvailability[] => {
  const roomsById = new Map(rooms.map((room) => [room.id, room]))
  const groupKey = (offer: RateOffer) =>
    offer.roomId && roomsById.has(offer.roomId) ? offer.roomId : `name:${offer.name}`
  const groups = offers.reduce(
    (map, offer) => map.set(groupKey(offer), [...(map.get(groupKey(offer)) ?? []), offer]),
    new Map<string, RateOffer[]>(),
  )
  return [...groups.entries()]
    .map(([key, group]) => ({ room: roomsById.get(key) ?? null, offers: group.toSorted(byTotal) }))
    .toSorted((a, b) => byTotal(a.offers[0]!, b.offers[0]!))
}
