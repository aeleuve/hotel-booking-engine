import type { Availability, Money, VendorRate } from './types'

/** Booking direct beats the cheapest channel by this share. */
export const DIRECT_DISCOUNT = 0.1

const hasTotal = (rate: VendorRate): rate is VendorRate & { total: Money } => rate.total !== null

/** Cheapest channel with a published total, or `null` when none is priced. */
export const cheapestRate = ({ rates }: Availability) =>
  rates
    .filter(hasTotal)
    .reduce<(VendorRate & { total: Money }) | null>(
      (best, rate) => (!best || rate.total.amount < best.total.amount ? rate : best),
      null,
    )

const roundToCents = (amount: number) => Math.round(amount * 100) / 100

/** Price on the official site: cheapest channel minus the direct discount. */
export const directPrice = (availability: Availability): Money | null => {
  const cheapest = cheapestRate(availability)
  if (!cheapest) return null
  return {
    amount: roundToCents(cheapest.total.amount * (1 - DIRECT_DISCOUNT)),
    currency: cheapest.total.currency,
  }
}
