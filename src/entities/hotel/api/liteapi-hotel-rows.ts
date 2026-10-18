import { countNights, toOccupancies } from '../model/stay'
import type {
  HotelProfile,
  Money,
  RateOffer,
  ReviewQuote,
  ReviewSummary,
  RoomType,
  StayQuery,
} from '../model/types'

export interface LiteApiRoomRow {
  id: number
  roomName: string
  roomSizeSquare: number | null
  roomSizeUnit: string | null
  maxOccupancy: number
  bedTypes: { quantity: number; bedType: string }[]
  photos: { url: string; mainPhoto: boolean }[]
}

export interface LiteApiHotelRow {
  id: string
  name: string
  address: string
  zip: string
  city: string
  phone: string
  email: string
  starRating: number
  rating: number
  reviewCount: number
  location: { latitude: number; longitude: number }
  main_photo: string
  checkinCheckoutTimes: { checkin_start: string; checkout: string }
  rooms: LiteApiRoomRow[]
}

export interface LiteApiHotelResponse {
  data: LiteApiHotelRow
}

export interface LiteApiReviewRow {
  reviewId: number
  averageScore: number
  country: string
  name: string
  headline: string
  language: string
  pros: string
  cons: string
}

export interface LiteApiReviewsResponse {
  data: LiteApiReviewRow[]
  total: number
}

export interface LiteApiCancelPolicyInfo {
  cancelTime: string
  amount: number
  currency: string
}

export interface LiteApiCancellationPolicies {
  cancelPolicyInfos: LiteApiCancelPolicyInfo[] | null
  refundableTag: 'RFN' | 'NRFN' | string
}

export interface LiteApiRateRow {
  mappedRoomId?: number | null
  name: string
  boardType: string
  boardName: string
  retailRate: {
    total: Money[]
    taxesAndFees?: { included: boolean; amount: number; currency: string }[] | null
  }
  cancellationPolicies: LiteApiCancellationPolicies
}

export interface LiteApiRoomTypeRow {
  offerId: string
  offerRetailRate: Money
  rates: LiteApiRateRow[]
}

export interface LiteApiRatesResponse {
  data: { hotelId: string; roomTypes: LiteApiRoomTypeRow[] }[]
}

export interface BrandContent {
  name: string
  whatsapp: string
  email: string
  heroImageUrl: string
  shuttleDepartures: string[]
}

/** LiteAPI error code for a search with no rooms left. */
export const NO_AVAILABILITY_CODE = 2001

/** `02:00 PM` → `14:00`; passes 24h values through. */
export const to24Hour = (time: string) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim())
  if (!match) return time
  const [, hours, minutes, period] = match
  const base = Number(hours) % 12
  return `${String(period!.toUpperCase() === 'PM' ? base + 12 : base).padStart(2, '0')}:${minutes}`
}

/** LiteAPI GMT times `2026-11-08 10:00:00` → ISO `2026-11-08T10:00:00Z`. */
export const toIsoTimestamp = (gmtTime: string) => `${gmtTime.replace(' ', 'T')}Z`

export const toHotelProfile = (row: LiteApiHotelRow, brand: BrandContent): HotelProfile => ({
  name: brand.name,
  propertyName: row.name,
  stars: row.starRating,
  address: [row.address, [row.zip, row.city].filter(Boolean).join(' ')].filter(Boolean).join(', '),
  phone: row.phone,
  whatsapp: brand.whatsapp,
  email: row.email || brand.email,
  location: row.location,
  checkInFrom: to24Hour(row.checkinCheckoutTimes.checkin_start),
  checkOutUntil: to24Hour(row.checkinCheckoutTimes.checkout),
  heroImageUrl: brand.heroImageUrl,
  shuttleDepartures: brand.shuttleDepartures,
})

const describeBed = ({ quantity, bedType }: LiteApiRoomRow['bedTypes'][number]) =>
  quantity > 1 ? `${quantity} × ${bedType}` : bedType

export const toRoomType = (row: LiteApiRoomRow): RoomType => ({
  id: String(row.id),
  name: row.roomName,
  sizeM2: row.roomSizeUnit === 'sqm' ? row.roomSizeSquare : null,
  maxGuests: row.maxOccupancy,
  beds: row.bedTypes.map(describeBed),
  photoUrls: row.photos
    .toSorted((a, b) => Number(b.mainPhoto) - Number(a.mainPhoto))
    .map(({ url }) => url),
})

const MIN_QUOTE_LENGTH = 20

const toReviewQuote = (row: LiteApiReviewRow): ReviewQuote => ({
  id: String(row.reviewId),
  author: row.name,
  country: row.country.toUpperCase(),
  language: row.language,
  score: row.averageScore,
  headline: row.headline,
  text: row.pros.trim(),
})

export const toReviewSummary = (
  hotel: LiteApiHotelRow,
  reviews: LiteApiReviewsResponse,
  limit = 3,
): ReviewSummary => ({
  score: hotel.rating,
  count: hotel.reviewCount,
  quotes: reviews.data
    .map(toReviewQuote)
    .filter(({ text }) => text.length >= MIN_QUOTE_LENGTH)
    .slice(0, limit),
})

const sumFees = (fees: NonNullable<LiteApiRateRow['retailRate']['taxesAndFees']>): Money | null =>
  fees.length
    ? {
        amount: Math.round(fees.reduce((sum, fee) => sum + fee.amount, 0) * 100) / 100,
        currency: fees[0]!.currency,
      }
    : null

const firstPenaltyTime = ({ cancelPolicyInfos, refundableTag }: LiteApiCancellationPolicies) => {
  if (refundableTag !== 'RFN' || !cancelPolicyInfos?.length) return null
  return toIsoTimestamp(cancelPolicyInfos.map(({ cancelTime }) => cancelTime).toSorted()[0]!)
}

export const toRateOffer = ({ offerId, offerRetailRate, rates }: LiteApiRoomTypeRow): RateOffer => {
  const rate = rates[0]!
  const fees = rate.retailRate.taxesAndFees ?? []
  return {
    offerId,
    roomId: rate.mappedRoomId ? String(rate.mappedRoomId) : null,
    name: rate.name,
    board: { code: rate.boardType, name: rate.boardName },
    refundable: rate.cancellationPolicies.refundableTag === 'RFN',
    freeCancellationUntil: firstPenaltyTime(rate.cancellationPolicies),
    total: offerRetailRate,
    taxesIncluded: sumFees(fees.filter(({ included }) => included)),
    payAtHotel: sumFees(fees.filter(({ included }) => !included)),
  }
}

export const toRateOffers = (response: LiteApiRatesResponse): RateOffer[] =>
  (response.data[0]?.roomTypes ?? []).map(toRateOffer)

interface RatesRequestOptions {
  hotelId: string
  currency: string
  nationality: string
}

export const toRatesRequest = (
  query: StayQuery,
  { hotelId, currency, nationality }: RatesRequestOptions,
) => ({
  hotelIds: [hotelId],
  occupancies: toOccupancies(query).map(({ adults, childrenAges }) => ({
    adults,
    children: childrenAges,
  })),
  currency,
  guestNationality: nationality,
  checkin: query.checkIn,
  checkout: query.checkOut,
  timeout: 8,
  roomMapping: true,
})

export const toAvailability = (query: StayQuery, response: LiteApiRatesResponse) => ({
  query,
  nights: countNights(query),
  offers: toRateOffers(response),
})
