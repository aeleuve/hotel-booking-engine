import type { HotelRepository } from '../model/ports'
import { countNights } from '../model/stay'
import { hotelProfile, offers, reviewSummary, roomTypes } from './hotel-catalog'
import { toVendorRates } from './makcorps-rows'
import { buildMakcorpsHotelFixture } from './mock-makcorps-fixture'

interface MockHotelOptions {
  /** Simulated network delay so loading states are visible in dev. */
  latencyMs?: number
}

const delay = <T>(value: T, ms: number) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))

/** Offline adapter: catalog content + Makcorps-shaped fixture prices. */
export const createMockHotel = ({ latencyMs = 400 }: MockHotelOptions = {}): HotelRepository => ({
  getProfile: () => delay(hotelProfile, latencyMs),
  listRooms: () => delay(roomTypes, latencyMs),
  listOffers: () => delay(offers, latencyMs),
  getReviewSummary: () => delay(reviewSummary, latencyMs),
  checkAvailability: (query) =>
    delay(
      { query, nights: countNights(query), rates: toVendorRates(buildMakcorpsHotelFixture(query)) },
      latencyMs,
    ),
})
