import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useBookingRepository,
  usePaymentGateway,
  type Booking,
  type CheckoutSession,
  type GuestDetails,
  type PaymentMountOptions,
} from 'src/entities/booking'
import type { RateOffer, StayQuery } from 'src/entities/hotel'
import { createSessionStore } from 'src/shared/lib/session-store'

export type CheckoutStatus = 'idle' | 'holding' | 'paying' | 'confirming' | 'confirmed' | 'error'
export type CheckoutError = 'hold-failed' | 'payment-failed' | 'booking-failed' | 'session-lost'

interface PendingCheckout {
  offer: RateOffer
  query: StayQuery
  holder: GuestDetails | null
  session: CheckoutSession | null
}

export const PAYMENT_TARGET = '#payment-target'

const pendingStore = createSessionStore<PendingCheckout>('pista-siete:checkout')
const confirmedStore = createSessionStore<{ prebookId: string; booking: Booking }>(
  'pista-siete:confirmed-booking',
)

export const emptyGuest = (): GuestDetails => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
})

/** Selected rate → held price → card payment → confirmed booking. Survives the payment redirect. */
export const useCheckoutStore = defineStore('checkout', () => {
  const repository = useBookingRepository()
  const gateway = usePaymentGateway()
  const pending = ref<PendingCheckout | null>(pendingStore.read())
  const booking = ref<Booking | null>(null)
  const status = ref<CheckoutStatus>('idle')
  const error = ref<CheckoutError | null>(null)

  const save = (next: PendingCheckout) => {
    pending.value = next
    pendingStore.write(next)
  }

  const start = (offer: RateOffer, query: StayQuery) => {
    save({
      offer: { ...offer },
      query: { ...query, childrenAges: [...query.childrenAges] },
      holder: null,
      session: null,
    })
    status.value = 'idle'
    error.value = null
  }

  const fail = (reason: CheckoutError) => {
    error.value = reason
    status.value = 'error'
  }

  const hold = async (holder: GuestDetails) => {
    if (!pending.value) return fail('session-lost')
    status.value = 'holding'
    try {
      const { offer, query } = pending.value
      save({ offer, query, holder, session: await repository.prebook({ offer, query }) })
      status.value = 'paying'
    } catch {
      fail('hold-failed')
    }
  }

  const mountPayment = async (options: Omit<PaymentMountOptions, 'secretKey'>) => {
    const session = pending.value?.session
    if (!session) return fail('session-lost')
    try {
      await gateway.mount(PAYMENT_TARGET, { ...options, secretKey: session.secretKey })
    } catch {
      fail('payment-failed')
    }
  }

  const complete = async (prebookId: string, transactionId: string) => {
    const confirmed = confirmedStore.read()
    if (confirmed?.prebookId === prebookId) {
      booking.value = confirmed.booking
      return (status.value = 'confirmed')
    }
    const current = pending.value
    if (!current?.holder || current.session?.prebookId !== prebookId) return fail('session-lost')
    status.value = 'confirming'
    try {
      const rooms = current.query.rooms
      booking.value = await repository.book({
        prebookId,
        transactionId,
        holder: current.holder,
        rooms,
      })
      confirmedStore.write({ prebookId, booking: booking.value })
      pendingStore.clear()
      pending.value = null
      status.value = 'confirmed'
    } catch {
      fail('booking-failed')
    }
  }

  return { pending, booking, status, error, start, hold, mountPayment, complete }
})
