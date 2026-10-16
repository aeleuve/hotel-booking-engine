/** ISO calendar date, `YYYY-MM-DD`. */
export type IsoDate = string

export type CurrencyCode = 'EUR'

export interface Money {
  amount: number
  currency: CurrencyCode
}

export interface StayQuery {
  checkIn: IsoDate
  checkOut: IsoDate
  adults: number
  children: number
  rooms: number
}

/** Price offered by one sales channel for a stay. */
export interface VendorRate {
  vendor: string
  nightly: Money | null
  total: Money | null
  tax: Money | null
}

export interface Availability {
  query: StayQuery
  nights: number
  rates: VendorRate[]
}

export type RoomId = 'standard' | 'executive' | 'suite'

export interface RoomType {
  id: RoomId
  sizeM2: number
  maxGuests: number
  bed: 'double' | 'king'
  imageUrl: string
  fromPrice: Money
}

export type OfferId = 'early-booking' | 'crew-rest' | 'meeting-day'

export interface Offer {
  id: OfferId
  discountPercent: number
  fromPrice: Money
  imageUrl: string
}

export interface ReviewQuote {
  author: string
  country: string
  /** BCP 47 tag of the quote's original language. */
  language: string
  score: number
  text: string
}

export interface ReviewSummary {
  score: number
  count: number
  quotes: ReviewQuote[]
}

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface HotelProfile {
  name: string
  stars: number
  address: string
  phone: string
  whatsapp: string
  email: string
  location: GeoPoint
  minutesToAirport: number
  heroImageUrl: string
  /** Shuttle departures from the hotel door, `HH:mm`. */
  shuttleDepartures: string[]
}
