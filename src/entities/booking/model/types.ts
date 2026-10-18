import type { IsoDate, IsoTimestamp, Money, RateOffer, StayQuery } from 'src/entities/hotel'

export interface GuestDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface PrebookRequest {
  offer: RateOffer
  query: StayQuery
}

/** Price held for the guest while they pay. */
export interface CheckoutSession {
  prebookId: string
  offerId: string
  transactionId: string
  secretKey: string
  price: Money
  /** The held price differs from the one shown in the search. */
  priceChanged: boolean
  /** Board or cancellation terms changed since the search. */
  termsChanged: boolean
}

export interface BookRequest {
  prebookId: string
  transactionId: string
  holder: GuestDetails
  rooms: number
}

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending'

export interface BookedRoom {
  name: string
  board: string
  adults: number
  children: number
}

export interface Booking {
  bookingId: string
  status: BookingStatus
  confirmationCode: string | null
  hotelName: string
  checkIn: IsoDate
  checkOut: IsoDate
  holder: GuestDetails
  price: Money
  rooms: BookedRoom[]
  refundable: boolean
  freeCancellationUntil: IsoTimestamp | null
}

export interface Cancellation {
  bookingId: string
  withCharges: boolean
  fee: Money
  refund: Money
}
