import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BOOKING_REPOSITORY,
  PAYMENT_GATEWAY,
  type BookingRepository,
  type PaymentGateway,
} from 'src/entities/booking'
import {
  createFakeBookingRepository,
  createFakePaymentGateway,
  fakeBooking,
  fakeSession,
} from 'src/entities/booking/model/fake-booking-repository'
import { defaultStay } from 'src/entities/hotel'
import { fakeOffer } from 'src/entities/hotel/model/fake-hotel-repository'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import { useCheckoutStore } from './checkout-store'

const holder = fakeBooking.holder
const query = { ...defaultStay('2026-11-10'), rooms: 1 }

const storeWith = (
  repository: BookingRepository = createFakeBookingRepository(),
  gateway: PaymentGateway = createFakePaymentGateway(),
) => {
  setupPiniaWith(provision(BOOKING_REPOSITORY, repository), provision(PAYMENT_GATEWAY, gateway))
  return useCheckoutStore()
}

const paymentOptions = { returnUrl: '/done', businessName: 'Hotel', payLabel: 'Pay' }

describe('checkout store', () => {
  afterEach(() => sessionStorage.clear())

  it('holds the price and mounts the payment form with its secret', async () => {
    const gateway = createFakePaymentGateway()
    const mount = vi.spyOn(gateway, 'mount')
    const store = storeWith(undefined, gateway)
    store.start(fakeOffer, query)

    await store.hold(holder)
    await store.mountPayment(paymentOptions)

    expect(store.status).toBe('paying')
    expect(store.pending?.session).toEqual(fakeSession)
    expect(mount).toHaveBeenCalledWith('#payment-target', {
      ...paymentOptions,
      secretKey: 'secret',
    })
  })

  it('books after the payment redirect, even with a fresh store', async () => {
    const first = storeWith()
    first.start(fakeOffer, query)
    await first.hold(holder)

    const repository = createFakeBookingRepository()
    const book = vi.spyOn(repository, 'book')
    const afterRedirect = storeWith(repository)
    await afterRedirect.complete('pre-1', 'tr-1')

    expect(book).toHaveBeenCalledWith({
      prebookId: 'pre-1',
      transactionId: 'tr-1',
      holder,
      rooms: 1,
    })
    expect(afterRedirect.status).toBe('confirmed')
    expect(afterRedirect.pending).toBeNull()
  })

  it('does not book twice when the confirmation page reloads', async () => {
    const store = storeWith()
    store.start(fakeOffer, query)
    await store.hold(holder)
    await store.complete('pre-1', 'tr-1')

    const repository = createFakeBookingRepository()
    const book = vi.spyOn(repository, 'book')
    const reloaded = storeWith(repository)
    await reloaded.complete('pre-1', 'tr-1')

    expect(book).not.toHaveBeenCalled()
    expect(reloaded.status).toBe('confirmed')
  })

  it('reports a failed hold', async () => {
    const store = storeWith(
      createFakeBookingRepository({ prebook: () => Promise.reject(new Error('sold out')) }),
    )
    store.start(fakeOffer, query)
    await store.hold(holder)
    expect(store.error).toBe('hold-failed')
  })

  it('reports a lost session when the redirect has no pending checkout', async () => {
    const store = storeWith()
    await store.complete('unknown', 'tr')
    expect(store.error).toBe('session-lost')
  })
})
