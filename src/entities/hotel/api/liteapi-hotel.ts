import { HttpError, type HttpClient } from 'src/shared/api/http-client'
import type { HotelRepository } from '../model/ports'
import { brandContent } from './hotel-catalog'
import {
  NO_AVAILABILITY_CODE,
  toAvailability,
  toHotelProfile,
  toRatesRequest,
  toReviewSummary,
  toRoomType,
  type LiteApiHotelResponse,
  type LiteApiRatesResponse,
  type LiteApiReviewsResponse,
} from './liteapi-hotel-rows'

interface LiteApiHotelOptions {
  hotelId: string
  currency?: string
  /** ISO country of the guest, read at search time (it follows the locale). */
  nationality: () => string
  /** Content language (ISO 639-1), read per request. */
  language: () => string
}

const REVIEWS_FETCHED = 10

const isNoAvailability = (error: unknown) =>
  error instanceof HttpError && error.code === NO_AVAILABILITY_CODE

/** Live adapter over LiteAPI data + rates endpoints (`api.liteapi.travel/v3.0`). */
export const createLiteApiHotel = (
  http: HttpClient,
  { hotelId, currency = 'EUR', nationality, language }: LiteApiHotelOptions,
): HotelRepository => {
  const details = new Map<string, Promise<LiteApiHotelResponse>>()
  /** One request per language; a failed one is forgotten so the next call retries. */
  const loadDetails = () => {
    const lang = language()
    const cached = details.get(lang)
    if (cached) return cached
    const request = http.get<LiteApiHotelResponse>('/data/hotel', { hotelId, language: lang })
    details.set(lang, request)
    request.catch(() => details.delete(lang))
    return request
  }

  return {
    getProfile: async () => toHotelProfile((await loadDetails()).data, brandContent),
    listRooms: async () => (await loadDetails()).data.rooms.map(toRoomType),
    getReviewSummary: async () => {
      const [hotel, reviews] = await Promise.all([
        loadDetails(),
        http.get<LiteApiReviewsResponse>('/data/reviews', { hotelId, limit: REVIEWS_FETCHED }),
      ])
      return toReviewSummary(hotel.data, reviews)
    },
    checkAvailability: async (query) => {
      const request = toRatesRequest(query, { hotelId, currency, nationality: nationality() })
      try {
        return toAvailability(
          query,
          await http.post<LiteApiRatesResponse>('/hotels/rates', request),
        )
      } catch (error) {
        if (isNoAvailability(error)) return toAvailability(query, { data: [] })
        throw error
      }
    },
  }
}
