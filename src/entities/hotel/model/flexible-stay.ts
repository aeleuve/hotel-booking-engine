import { addDays } from './stay'
import type { Availability, IsoDate, Money, RateOffer, RoomType } from './types'

export type CheckInDay = 'friday'

/** "Cheapest <nights> in <month>", optionally pinned to a check-in weekday. */
export interface FlexibleStay {
  /** `YYYY-MM` */
  month: string
  nights: number
  checkInDay: CheckInDay | null
}

export interface DateRange {
  checkIn: IsoDate
  checkOut: IsoDate
}

const FRIDAY = 5

/**
 * Every date range with check-in and check-out inside the month, from today on.
 * A weekend search keeps Friday check-ins only.
 */
export const flexibleStayRanges = (
  { month, nights, checkInDay }: FlexibleStay,
  today: IsoDate,
): DateRange[] => {
  const [year, monthNumber] = month.split('-').map(Number) as [number, number]
  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
  return Array.from(
    { length: Math.max(0, daysInMonth - nights) },
    (_, index) => `${month}-${String(index + 1).padStart(2, '0')}`,
  )
    .filter((checkIn) => checkIn >= today)
    .filter(
      (checkIn) =>
        checkInDay !== 'friday' || new Date(`${checkIn}T00:00:00Z`).getUTCDay() === FRIDAY,
    )
    .map((checkIn) => ({ checkIn, checkOut: addDays(checkIn, nights) }))
}

const payableTotal = ({ total, payAtHotel }: RateOffer): Money => ({
  currency: total.currency,
  amount: total.amount + (payAtHotel?.currency === total.currency ? payAtHotel.amount : 0),
})

const matchesRoomType = (offer: RateOffer, rooms: RoomType[], roomType: string) => {
  const wanted = roomType.trim().toLowerCase()
  const roomName = rooms.find((room) => room.id === offer.roomId)?.name ?? ''
  return [roomName, offer.name].some((name) => name.toLowerCase().includes(wanted))
}

/** Lowest amount the guest pays for this date range (online + at the hotel), for the requested room type if any. */
export const bestStayPrice = (
  availability: Availability,
  rooms: RoomType[],
  roomType?: string,
): Money | null =>
  availability.offers
    .filter((offer) => !roomType || matchesRoomType(offer, rooms, roomType))
    .map(payableTotal)
    .toSorted((a, b) => a.amount - b.amount)[0] ?? null
