import type { HttpGet } from 'src/shared/api/http-client'
import type { HotelRepository } from '../model/ports'
import { countNights } from '../model/stay'
import { hotelProfile, offers, reviewSummary, roomTypes } from './hotel-catalog'
import { toMakcorpsHotelParams, toVendorRates, type MakcorpsHotelResponse } from './makcorps-rows'

interface MakcorpsHotelOptions {
  apiKey: string
  /** Makcorps hotel whose live prices stand in for ours. */
  hotelId: string
}

/** Live adapter: catalog content + real channel prices from Makcorps `/hotel`. */
export const createMakcorpsHotel = (
  http: HttpGet,
  { apiKey, hotelId }: MakcorpsHotelOptions,
): HotelRepository => ({
  getProfile: () => Promise.resolve(hotelProfile),
  listRooms: () => Promise.resolve(roomTypes),
  listOffers: () => Promise.resolve(offers),
  getReviewSummary: () => Promise.resolve(reviewSummary),
  checkAvailability: async (query) => {
    const response = await http<MakcorpsHotelResponse>('/hotel', {
      ...toMakcorpsHotelParams(hotelId, query),
      api_key: apiKey,
    })
    return { query, nights: countNights(query), rates: toVendorRates(response) }
  },
})
