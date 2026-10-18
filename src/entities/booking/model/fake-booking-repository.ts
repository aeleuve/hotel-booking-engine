import type { BookingRepository, PaymentGateway } from './ports'
import type { Booking, CheckoutSession } from './types'

const eur = (amount: number) => ({ amount, currency: 'EUR' })

export const fakeSession: CheckoutSession = {
  prebookId: 'pre-1',
  offerId: 'offer-1',
  transactionId: 'tr-1',
  secretKey: 'secret',
  price: eur(200),
  priceChanged: false,
  termsChanged: false,
}

export const fakeBooking: Booking = {
  bookingId: 'BK-1',
  status: 'confirmed',
  confirmationCode: 'HC-1',
  hotelName: 'Test Property',
  checkIn: '2026-11-10',
  checkOut: '2026-11-12',
  holder: { firstName: 'Ana', lastName: 'Ruiz', email: 'ana@example.test', phone: '+34600000000' },
  price: eur(200),
  rooms: [{ name: 'Double Room', board: 'Room Only', adults: 2, children: 0 }],
  refundable: true,
  freeCancellationUntil: '2026-11-08T10:00:00Z',
}

/** In-memory booking repository for unit tests; override any method per test. */
export const createFakeBookingRepository = (
  overrides: Partial<BookingRepository> = {},
): BookingRepository => ({
  prebook: () => Promise.resolve(fakeSession),
  book: () => Promise.resolve(fakeBooking),
  getBooking: () => Promise.resolve(fakeBooking),
  cancelBooking: (bookingId) =>
    Promise.resolve({ bookingId, withCharges: false, fee: eur(0), refund: eur(200) }),
  ...overrides,
})

export const createFakePaymentGateway = (): PaymentGateway => ({ mount: () => Promise.resolve() })
