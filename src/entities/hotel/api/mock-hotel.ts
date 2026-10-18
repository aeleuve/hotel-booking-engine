import type { HotelRepository } from '../model/ports'
import { brandContent } from './hotel-catalog'
import { toAvailability, toHotelProfile, toReviewSummary, toRoomType } from './liteapi-hotel-rows'
import { buildRatesFixture } from './mock-liteapi-rates'
import { hotelDetailsFixture, reviewsFixture } from './mock-liteapi-fixtures'

interface MockHotelOptions {
  /** Simulated network delay so loading states are visible in dev. */
  latencyMs?: number
}

const delay = <T>(value: T, ms: number) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms))

/** Offline adapter: captured LiteAPI payloads through the real mappers. */
export const createMockHotel = ({ latencyMs = 400 }: MockHotelOptions = {}): HotelRepository => {
  const hotel = hotelDetailsFixture.data
  return {
    getProfile: () => delay(toHotelProfile(hotel, brandContent), latencyMs),
    listRooms: () => delay(hotel.rooms.map(toRoomType), latencyMs),
    getReviewSummary: () => delay(toReviewSummary(hotel, reviewsFixture), latencyMs),
    checkAvailability: (query) =>
      delay(toAvailability(query, buildRatesFixture(hotel, query)), latencyMs),
  }
}
