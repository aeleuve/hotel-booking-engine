import { inject, type InjectionKey } from 'vue'
import type { Booking, BookRequest, Cancellation, CheckoutSession, PrebookRequest } from './types'

/** Port: hold a price, confirm it, and manage the booking afterwards. */
export interface BookingRepository {
  prebook(request: PrebookRequest): Promise<CheckoutSession>
  book(request: BookRequest): Promise<Booking>
  getBooking(bookingId: string): Promise<Booking>
  cancelBooking(bookingId: string): Promise<Cancellation>
}

export interface PaymentMountOptions {
  secretKey: string
  /** Page the guest lands on after paying. */
  returnUrl: string
  businessName: string
  /** Label for the pay button when the gateway renders its own. */
  payLabel: string
}

/** Port: renders the card form and sends the guest to `returnUrl` once paid. */
export interface PaymentGateway {
  mount(targetSelector: string, options: PaymentMountOptions): Promise<void>
}

export const BOOKING_REPOSITORY: InjectionKey<BookingRepository> = Symbol('BookingRepository')
export const PAYMENT_GATEWAY: InjectionKey<PaymentGateway> = Symbol('PaymentGateway')

const injectOrThrow = <T>(key: InjectionKey<T>, name: string): T => {
  const value = inject(key)
  if (!value) throw new Error(`${name} not provided. Check app/boot/repositories.`)
  return value
}

export const useBookingRepository = () => injectOrThrow(BOOKING_REPOSITORY, 'BookingRepository')
export const usePaymentGateway = () => injectOrThrow(PAYMENT_GATEWAY, 'PaymentGateway')
