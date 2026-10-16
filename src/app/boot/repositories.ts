import { defineBoot } from '#q-app/wrappers'
import { createMakcorpsHotel } from 'src/entities/hotel/api/makcorps-hotel'
import { createMockHotel } from 'src/entities/hotel/api/mock-hotel'
import { HOTEL_REPOSITORY, type HotelRepository } from 'src/entities/hotel'
import { createFetchHttp } from 'src/shared/api/http-client'

const MAKCORPS_BASE_URL = 'https://api.makcorps.com'

const createHotelRepository = (): HotelRepository =>
  process.env.HOTEL_ADAPTER === 'makcorps'
    ? createMakcorpsHotel(createFetchHttp(MAKCORPS_BASE_URL), {
        apiKey: process.env.HOTEL_API_KEY ?? '',
        hotelId: process.env.HOTEL_MAKCORPS_ID ?? '',
      })
    : createMockHotel()

/** Composition root: binds every port to its adapter. */
export default defineBoot(({ app }) => {
  app.provide(HOTEL_REPOSITORY, createHotelRepository())
})
