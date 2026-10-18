import type { Booking } from './types'

/** A booking can be cancelled for free until its deadline; refundable ones without one, any time. */
export const canCancelFree = (booking: Booking, now: Date) =>
  booking.status === 'confirmed' &&
  booking.refundable &&
  (!booking.freeCancellationUntil || new Date(booking.freeCancellationUntil) > now)

export const emailsMatch = (a: string, b: string) =>
  a.trim().toLowerCase() === b.trim().toLowerCase()
