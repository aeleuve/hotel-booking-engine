import { describe, expect, it, vi } from 'vitest'
import type { HttpClient } from 'src/shared/api/http-client'
import { fakeOffer } from 'src/entities/hotel/model/fake-hotel-repository'
import { defaultStay } from 'src/entities/hotel'
import { createLiteApiBooking } from './liteapi-booking'
import { toBookingStatus } from './liteapi-booking-rows'

const holder = {
  firstName: 'Ana',
  lastName: 'Ruiz',
  email: 'ana@example.test',
  phone: '+34600000000',
}

const bookingRow = {
  data: {
    bookingId: 'BK-9',
    status: 'CONFIRMED',
    hotelConfirmationCode: '',
    hotel: { hotelId: 'lp42e6e', name: 'Hotel Maydrit Airport' },
    checkin: '2026-11-10',
    checkout: '2026-11-12',
    holder,
    price: 500.31,
    currency: 'EUR',
    bookedRooms: [
      { roomType: { name: 'Double Room' }, boardName: 'Room Only', adults: 2, children: 0 },
    ],
    cancellationPolicies: { refundableTag: 'RFN' },
    lastFreeCancellationDate: '2026-11-03T18:00:00Z',
  },
}

const httpWith = (overrides: Partial<HttpClient>): HttpClient => ({
  get: vi.fn() as HttpClient['get'],
  post: vi.fn() as HttpClient['post'],
  put: vi.fn() as HttpClient['put'],
  ...overrides,
})

describe('liteapi booking adapter', () => {
  it('prebooks with the payment SDK and flags price changes', async () => {
    const post = vi.fn(() =>
      Promise.resolve({
        data: {
          prebookId: 'AwNd961yg',
          offerId: fakeOffer.offerId,
          price: 510,
          currency: 'EUR',
          priceDifferencePercent: 2,
          cancellationChanged: false,
          boardChanged: false,
          transactionId: 'tr_1',
          secretKey: 'pi_secret',
        },
      }),
    ) as unknown as HttpClient['post']
    const repository = createLiteApiBooking(httpWith({ post }))

    const session = await repository.prebook({ offer: fakeOffer, query: defaultStay('2026-11-10') })

    expect(post).toHaveBeenCalledWith('/rates/prebook', { offerId: 'offer-1', usePaymentSdk: true })
    expect(session).toMatchObject({
      prebookId: 'AwNd961yg',
      priceChanged: true,
      termsChanged: false,
    })
  })

  it('books one guest per room with the transaction id', async () => {
    const post = vi.fn(() => Promise.resolve(bookingRow)) as unknown as HttpClient['post']
    const repository = createLiteApiBooking(httpWith({ post }))

    const booking = await repository.book({
      prebookId: 'AwNd961yg',
      transactionId: 'tr_1',
      holder,
      rooms: 2,
    })

    expect(post).toHaveBeenCalledWith(
      '/rates/book',
      expect.objectContaining({
        clientReference: 'AwNd961yg',
        payment: { method: 'TRANSACTION_ID', transactionId: 'tr_1' },
        guests: [
          expect.objectContaining({ occupancyNumber: 1, firstName: 'Ana' }),
          expect.objectContaining({ occupancyNumber: 2, firstName: 'Ana' }),
        ],
      }),
      { timeout: 30 },
    )
    expect(booking).toMatchObject({
      bookingId: 'BK-9',
      status: 'confirmed',
      confirmationCode: null,
      refundable: true,
      rooms: [{ name: 'Double Room', board: 'Room Only', adults: 2, children: 0 }],
    })
  })

  it('cancels and reports the refund', async () => {
    const put = vi.fn(() =>
      Promise.resolve({
        data: {
          bookingId: 'BK-9',
          status: 'CANCELLED',
          currency: 'EUR',
          cancellation_fee: 0,
          refund_amount: 500.31,
        },
      }),
    ) as unknown as HttpClient['put']
    const repository = createLiteApiBooking(httpWith({ put }))

    await expect(repository.cancelBooking('BK-9')).resolves.toEqual({
      bookingId: 'BK-9',
      withCharges: false,
      fee: { amount: 0, currency: 'EUR' },
      refund: { amount: 500.31, currency: 'EUR' },
    })
    expect(put).toHaveBeenCalledWith('/bookings/BK-9')
  })

  it.each([
    ['CONFIRMED', 'confirmed'],
    ['CANCELED', 'cancelled'],
    ['CANCELLED_WITH_CHARGES', 'cancelled'],
    ['PENDING', 'pending'],
  ])('maps status %s', (raw, status) => {
    expect(toBookingStatus(raw)).toBe(status)
  })
})
