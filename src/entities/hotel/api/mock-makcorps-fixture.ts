import { countNights } from '../model/stay'
import type { StayQuery } from '../model/types'
import type { MakcorpsHotelResponse } from './makcorps-rows'

const VENDOR_MARKUPS: [vendor: string, markup: number][] = [
  ['Booking.com', 1],
  ['Expedia.com', 1.04],
  ['Hotels.com', 1.07],
  ['Trip.com', 0.98],
]

const BASE_NIGHTLY = 92
const TAX_RATE = 0.1

const isWeekendNight = (checkIn: string) =>
  [5, 6].includes(new Date(`${checkIn}T00:00:00Z`).getUTCDay())

/** Business hotel: weekends are cheaper, extra guests add a supplement. */
const nightlyFor = (query: StayQuery) => {
  const supplement = (query.adults - 1) * 14 + query.children * 9
  const weekendFactor = isWeekendNight(query.checkIn) ? 0.85 : 1
  return (BASE_NIGHTLY + supplement) * weekendFactor * query.rooms
}

const euros = (amount: number) => `€${Math.round(amount)}`

/** Builds a `/hotel` response with the same shape the real Makcorps API returns. */
export const buildMakcorpsHotelFixture = (query: StayQuery): MakcorpsHotelResponse => {
  const nights = countNights(query)
  const nightly = nightlyFor(query)
  const cells = VENDOR_MARKUPS.map(([vendor, markup], index) => {
    const n = index + 1
    const price = nightly * markup
    return {
      [`vendor${n}`]: vendor,
      [`price${n}`]: euros(price),
      [`Totalprice${n}`]: euros(price * nights * (1 + TAX_RATE)),
      [`tax${n}`]: euros(price * nights * TAX_RATE),
    }
  })
  return { comparison: [cells] }
}
