import { defineBoot } from '#q-app/wrappers'
import { createLiteApiBooking } from 'src/entities/booking/api/liteapi-booking'
import { createMockBooking } from 'src/entities/booking/api/mock-booking'
import { createMockPayment } from 'src/entities/booking/api/mock-payment'
import { createNuiteePayment } from 'src/entities/booking/api/nuitee-payment'
import { BOOKING_REPOSITORY, PAYMENT_GATEWAY } from 'src/entities/booking'
import { createLiteApiHotel } from 'src/entities/hotel/api/liteapi-hotel'
import { createMockHotel } from 'src/entities/hotel/api/mock-hotel'
import { HOTEL_REPOSITORY } from 'src/entities/hotel'
import { createJsonHttp } from 'src/shared/api/http-client'
import { nationalityFor } from 'src/shared/i18n'

const LITEAPI_DATA_URL = 'https://api.liteapi.travel/v3.0'
const LITEAPI_BOOK_URL = 'https://book.liteapi.travel/v3.0'

const currentLanguage = () => document.documentElement.lang || 'en'
const currentNationality = () => nationalityFor(currentLanguage())

const liteApiAdapters = (apiKey: string, hotelId: string) => {
  const headers = { 'X-API-Key': apiKey }
  return {
    hotel: createLiteApiHotel(createJsonHttp(LITEAPI_DATA_URL, { headers }), {
      hotelId,
      nationality: currentNationality,
      language: currentLanguage,
    }),
    booking: createLiteApiBooking(createJsonHttp(LITEAPI_BOOK_URL, { headers })),
    payment: createNuiteePayment(apiKey),
  }
}

const mockAdapters = () => ({
  hotel: createMockHotel(),
  booking: createMockBooking(),
  payment: createMockPayment(),
})

/** Composition root: binds every port to its adapter. */
export default defineBoot(({ app }) => {
  const adapters =
    process.env.HOTEL_ADAPTER === 'liteapi'
      ? liteApiAdapters(process.env.LITEAPI_KEY ?? '', process.env.LITEAPI_HOTEL_ID ?? '')
      : mockAdapters()
  app.provide(HOTEL_REPOSITORY, adapters.hotel)
  app.provide(BOOKING_REPOSITORY, adapters.booking)
  app.provide(PAYMENT_GATEWAY, adapters.payment)
})
