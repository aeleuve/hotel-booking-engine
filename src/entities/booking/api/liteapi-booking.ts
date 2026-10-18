import type { HttpClient } from 'src/shared/api/http-client'
import type { BookingRepository } from '../model/ports'
import {
  toBookBody,
  toBooking,
  toCancellation,
  toCheckoutSession,
  type LiteApiBookingResponse,
  type LiteApiCancelResponse,
  type LiteApiPrebookResponse,
} from './liteapi-booking-rows'

const BOOK_TIMEOUT_S = 30

/** Live adapter over LiteAPI booking endpoints (`book.liteapi.travel/v3.0`). */
export const createLiteApiBooking = (http: HttpClient): BookingRepository => ({
  prebook: async ({ offer }) =>
    toCheckoutSession(
      await http.post<LiteApiPrebookResponse>('/rates/prebook', {
        offerId: offer.offerId,
        usePaymentSdk: true,
      }),
    ),
  book: async (request) =>
    toBooking(
      await http.post<LiteApiBookingResponse>('/rates/book', toBookBody(request), {
        timeout: BOOK_TIMEOUT_S,
      }),
    ),
  getBooking: async (bookingId) =>
    toBooking(await http.get<LiteApiBookingResponse>(`/bookings/${encodeURIComponent(bookingId)}`)),
  cancelBooking: async (bookingId) =>
    toCancellation(
      await http.put<LiteApiCancelResponse>(`/bookings/${encodeURIComponent(bookingId)}`),
    ),
})
