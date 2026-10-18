/** ISO calendar date, `YYYY-MM-DD`. */
export type IsoDate = string

/** ISO timestamp, e.g. `2026-11-08T10:00:00Z`. */
export type IsoTimestamp = string

export interface Money {
  amount: number
  currency: string
}

export interface StayQuery {
  checkIn: IsoDate
  checkOut: IsoDate
  adults: number
  /** One age (0–17) per child; `null` until the guest picks it. */
  childrenAges: (number | null)[]
  rooms: number
}

/** Guests sharing one room. */
export interface Occupancy {
  adults: number
  childrenAges: number[]
}

export interface Board {
  code: string
  name: string
}

/** One bookable price for one room type. */
export interface RateOffer {
  offerId: string
  roomId: string | null
  name: string
  board: Board
  refundable: boolean
  freeCancellationUntil: IsoTimestamp | null
  total: Money
  taxesIncluded: Money | null
  /** Fees not in `total`, paid at the property. */
  payAtHotel: Money | null
}

export interface Availability {
  query: StayQuery
  nights: number
  offers: RateOffer[]
}

export interface RoomType {
  id: string
  name: string
  sizeM2: number | null
  maxGuests: number
  beds: string[]
  photoUrls: string[]
}

export interface ReviewQuote {
  id: string
  author: string
  country: string
  /** BCP 47 tag of the quote's original language. */
  language: string
  score: number
  headline: string
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
  /** Brand shown to guests. */
  name: string
  /** Property the inventory comes from. */
  propertyName: string
  stars: number
  address: string
  phone: string
  whatsapp: string
  email: string
  location: GeoPoint
  checkInFrom: string
  checkOutUntil: string
  heroImageUrl: string
  /** Shuttle departures from the hotel door, `HH:mm`. */
  shuttleDepartures: string[]
}
