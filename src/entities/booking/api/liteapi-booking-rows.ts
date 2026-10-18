import type { Money } from 'src/entities/hotel'
import type {
  Booking,
  BookingStatus,
  BookRequest,
  Cancellation,
  CheckoutSession,
  GuestDetails,
} from '../model/types'

export interface LiteApiPrebookResponse {
  data: {
    prebookId: string
    offerId: string
    price: number
    currency: string
    priceDifferencePercent: number
    cancellationChanged: boolean
    boardChanged: boolean
    transactionId: string
    secretKey: string
  }
}

export interface LiteApiBookedRoomRow {
  roomType?: { name?: string } | null
  boardName?: string
  adults?: number
  children?: number
}

export interface LiteApiBookingRow {
  bookingId: string
  status: string
  hotelConfirmationCode?: string | null
  hotel?: { hotelId: string; name: string } | null
  checkin: string
  checkout: string
  holder?: Partial<GuestDetails> | null
  price: number
  currency: string
  bookedRooms?: LiteApiBookedRoomRow[] | null
  cancellationPolicies?: { refundableTag?: string } | null
  lastFreeCancellationDate?: string | null
}

export interface LiteApiBookingResponse {
  data: LiteApiBookingRow
}

export interface LiteApiCancelResponse {
  data: {
    bookingId: string
    status: string
    currency: string
    cancellation_fee?: number
    refund_amount?: number
  }
}

export const toCheckoutSession = ({ data }: LiteApiPrebookResponse): CheckoutSession => ({
  prebookId: data.prebookId,
  offerId: data.offerId,
  transactionId: data.transactionId,
  secretKey: data.secretKey,
  price: { amount: data.price, currency: data.currency },
  priceChanged: data.priceDifferencePercent !== 0,
  termsChanged: data.cancellationChanged || data.boardChanged,
})

export const toBookBody = ({ prebookId, transactionId, holder, rooms }: BookRequest) => ({
  prebookId,
  clientReference: prebookId,
  holder,
  guests: Array.from({ length: rooms }, (_, index) => ({
    occupancyNumber: index + 1,
    firstName: holder.firstName,
    lastName: holder.lastName,
    email: holder.email,
  })),
  payment: { method: 'TRANSACTION_ID', transactionId },
})

/** LiteAPI spells it CANCELED and CANCELLED depending on the endpoint. */
export const toBookingStatus = (status: string): BookingStatus => {
  if (status === 'CONFIRMED') return 'confirmed'
  if (status.startsWith('CANCEL')) return 'cancelled'
  return 'pending'
}

const toDate = (value: string) => value.slice(0, 10)

const emptyHolder: GuestDetails = { firstName: '', lastName: '', email: '', phone: '' }

export const toBooking = ({ data }: LiteApiBookingResponse): Booking => ({
  bookingId: data.bookingId,
  status: toBookingStatus(data.status),
  confirmationCode: data.hotelConfirmationCode || null,
  hotelName: data.hotel?.name ?? '',
  checkIn: toDate(data.checkin),
  checkOut: toDate(data.checkout),
  holder: { ...emptyHolder, ...data.holder },
  price: { amount: data.price, currency: data.currency },
  rooms: (data.bookedRooms ?? []).map((room) => ({
    name: room.roomType?.name ?? '',
    board: room.boardName ?? '',
    adults: room.adults ?? 0,
    children: room.children ?? 0,
  })),
  refundable: data.cancellationPolicies?.refundableTag === 'RFN',
  freeCancellationUntil: data.lastFreeCancellationDate || null,
})

export const toCancellation = ({ data }: LiteApiCancelResponse): Cancellation => {
  const money = (amount = 0): Money => ({ amount, currency: data.currency })
  return {
    bookingId: data.bookingId,
    withCharges: data.status === 'CANCELLED_WITH_CHARGES',
    fee: money(data.cancellation_fee),
    refund: money(data.refund_amount),
  }
}
