import { describe, expect, it } from 'vitest'
import { BOOKING_REPOSITORY, type BookingRepository } from 'src/entities/booking'
import {
  createFakeBookingRepository,
  fakeBooking,
} from 'src/entities/booking/model/fake-booking-repository'
import { provision, setupPiniaWith } from 'src/shared/lib/testing'
import { useManageBookingStore } from './manage-booking-store'

const storeWith = (repository: BookingRepository = createFakeBookingRepository()) => {
  setupPiniaWith(provision(BOOKING_REPOSITORY, repository))
  return useManageBookingStore()
}

describe('manage booking store', () => {
  it('finds a booking when the email matches', async () => {
    const store = storeWith()
    await store.lookup(' BK-1 ', 'ANA@example.test')
    expect(store.status).toBe('found')
    expect(store.booking?.bookingId).toBe('BK-1')
  })

  it('hides bookings behind a different email', async () => {
    const store = storeWith()
    await store.lookup('BK-1', 'someone@else.test')
    expect(store.error).toBe('not-found')
    expect(store.booking).toBeNull()
  })

  it('cancels and keeps the refund', async () => {
    const store = storeWith()
    await store.lookup('BK-1', fakeBooking.holder.email)
    await store.cancel()
    expect(store.status).toBe('cancelled')
    expect(store.booking?.status).toBe('cancelled')
    expect(store.cancellation?.refund.amount).toBe(200)
  })

  it('stays on the booking when cancelling fails', async () => {
    const store = storeWith(
      createFakeBookingRepository({ cancelBooking: () => Promise.reject(new Error('x')) }),
    )
    await store.lookup('BK-1', fakeBooking.holder.email)
    await store.cancel()
    expect(store.status).toBe('found')
    expect(store.error).toBe('cancel-failed')
  })
})
