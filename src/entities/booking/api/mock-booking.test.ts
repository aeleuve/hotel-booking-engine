import { afterEach, describe, expect, it } from 'vitest'
import { defaultStay } from 'src/entities/hotel'
import { fakeOffer } from 'src/entities/hotel/model/fake-hotel-repository'
import { createMockBooking } from './mock-booking'

const holder = { firstName: 'Ana', lastName: 'Ruiz', email: 'ana@example.test', phone: '' }

describe('mock booking adapter', () => {
  afterEach(() => sessionStorage.clear())

  it('books, finds and cancels across adapter instances', async () => {
    const session = await createMockBooking().prebook({
      offer: fakeOffer,
      query: defaultStay('2026-11-10'),
    })
    const booking = await createMockBooking().book({ ...session, holder, rooms: 1 })

    const repository = createMockBooking()
    await expect(repository.getBooking(booking.bookingId)).resolves.toMatchObject({
      holder,
      status: 'confirmed',
    })
    await expect(repository.cancelBooking(booking.bookingId)).resolves.toMatchObject({
      withCharges: false,
    })
    await expect(repository.getBooking(booking.bookingId)).resolves.toMatchObject({
      status: 'cancelled',
    })
  })

  it('rejects unknown bookings', async () => {
    await expect(createMockBooking().getBooking('nope')).rejects.toThrow('not found')
  })
})
