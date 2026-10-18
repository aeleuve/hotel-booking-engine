import { createSessionStore } from 'src/shared/lib/session-store'
import type { BookingRepository } from '../model/ports'
import type { Booking, CheckoutSession, PrebookRequest } from '../model/types'

interface MockState {
  holds: Record<string, PrebookRequest & { session: CheckoutSession }>
  bookings: Record<string, Booking>
}

const store = createSessionStore<MockState>('pista-siete:mock-bookings')
const readState = (): MockState => store.read() ?? { holds: {}, bookings: {} }
const update = (change: (state: MockState) => void) => {
  const state = readState()
  change(state)
  store.write(state)
}

const randomId = (prefix: string) =>
  `${prefix}${Math.random().toString(36).slice(2, 10).toUpperCase()}`

const notFound = () => Promise.reject(new Error('booking id not found'))

const toBooking = (
  { offer, query, session }: MockState['holds'][string],
  holder: Booking['holder'],
): Booking => ({
  bookingId: randomId('MK'),
  status: 'confirmed',
  confirmationCode: randomId('HC'),
  hotelName: 'Hotel Maydrit Airport',
  checkIn: query.checkIn,
  checkOut: query.checkOut,
  holder,
  price: session.price,
  rooms: [
    {
      name: offer.name,
      board: offer.board.name,
      adults: query.adults,
      children: query.childrenAges.length,
    },
  ],
  refundable: offer.refundable,
  freeCancellationUntil: offer.freeCancellationUntil,
})

/** Offline booking adapter. State lives in `sessionStorage` so it survives the payment redirect. */
export const createMockBooking = (): BookingRepository => ({
  prebook: (request) => {
    const session: CheckoutSession = {
      prebookId: randomId('PB'),
      offerId: request.offer.offerId,
      transactionId: randomId('TR'),
      secretKey: 'mock-secret',
      price: request.offer.total,
      priceChanged: false,
      termsChanged: false,
    }
    update((state) => (state.holds[session.prebookId] = { ...request, session }))
    return Promise.resolve(session)
  },
  book: ({ prebookId, holder }) => {
    const hold = readState().holds[prebookId]
    if (!hold) return Promise.reject(new Error('prebook not found'))
    const booking = toBooking(hold, holder)
    update((state) => (state.bookings[booking.bookingId] = booking))
    return Promise.resolve(booking)
  },
  getBooking: (bookingId) => {
    const booking = readState().bookings[bookingId]
    return booking ? Promise.resolve(booking) : notFound()
  },
  cancelBooking: (bookingId) => {
    const booking = readState().bookings[bookingId]
    if (!booking) return notFound()
    update((state) => (state.bookings[bookingId] = { ...booking, status: 'cancelled' }))
    const fee = {
      amount: booking.refundable ? 0 : booking.price.amount,
      currency: booking.price.currency,
    }
    const refund = { amount: booking.price.amount - fee.amount, currency: booking.price.currency }
    return Promise.resolve({ bookingId, withCharges: fee.amount > 0, fee, refund })
  },
})
