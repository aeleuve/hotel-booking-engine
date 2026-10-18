import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  emailsMatch,
  useBookingRepository,
  type Booking,
  type Cancellation,
} from 'src/entities/booking'

export type ManageStatus = 'idle' | 'looking' | 'found' | 'cancelling' | 'cancelled' | 'error'
export type ManageError = 'not-found' | 'cancel-failed'

/**
 * Finds a booking by id + holder email and cancels it.
 * The email check runs in the browser: acceptable for the sandbox only.
 */
export const useManageBookingStore = defineStore('manage-booking', () => {
  const repository = useBookingRepository()
  const booking = ref<Booking | null>(null)
  const cancellation = ref<Cancellation | null>(null)
  const status = ref<ManageStatus>('idle')
  const error = ref<ManageError | null>(null)

  const fail = (reason: ManageError) => {
    error.value = reason
    status.value = 'error'
  }

  const lookup = async (bookingId: string, email: string) => {
    status.value = 'looking'
    error.value = null
    cancellation.value = null
    try {
      const found = await repository.getBooking(bookingId.trim())
      if (!emailsMatch(found.holder.email, email)) return fail('not-found')
      booking.value = found
      status.value = 'found'
    } catch {
      fail('not-found')
    }
  }

  const cancel = async () => {
    if (!booking.value) return
    status.value = 'cancelling'
    try {
      cancellation.value = await repository.cancelBooking(booking.value.bookingId)
      booking.value = { ...booking.value, status: 'cancelled' }
      status.value = 'cancelled'
    } catch {
      error.value = 'cancel-failed'
      status.value = 'found'
    }
  }

  return { booking, cancellation, status, error, lookup, cancel }
})
