import type { IsoDate, Occupancy, StayQuery } from './types'

const DAY_MS = 86_400_000

export const MAX_NIGHTS = 30
export const MAX_ADULTS = 6
export const MAX_CHILDREN = 4
export const MAX_CHILD_AGE = 17

export type StayError =
  | 'check-in-past'
  | 'check-out-before-check-in'
  | 'too-many-nights'
  | 'no-adults'
  | 'child-age-missing'

const toUtc = (date: IsoDate): number => Date.parse(`${date}T00:00:00Z`)

export const toIsoDate = (date: Date): IsoDate => date.toISOString().slice(0, 10)

export const addDays = (date: IsoDate, days: number): IsoDate =>
  toIsoDate(new Date(toUtc(date) + days * DAY_MS))

export const countNights = ({ checkIn, checkOut }: Pick<StayQuery, 'checkIn' | 'checkOut'>) =>
  Math.round((toUtc(checkOut) - toUtc(checkIn)) / DAY_MS)

/** One night, two adults, starting today. */
export const defaultStay = (today: IsoDate): StayQuery => ({
  checkIn: today,
  checkOut: addDays(today, 1),
  adults: 2,
  childrenAges: [],
  rooms: 1,
})

/** Returns the first rule the stay breaks, or `null` when it can be searched. */
export const validateStay = (query: StayQuery, today: IsoDate): StayError | null => {
  const nights = countNights(query)
  if (toUtc(query.checkIn) < toUtc(today)) return 'check-in-past'
  if (nights < 1) return 'check-out-before-check-in'
  if (nights > MAX_NIGHTS) return 'too-many-nights'
  if (query.adults < 1) return 'no-adults'
  if (query.childrenAges.some((age) => age === null)) return 'child-age-missing'
  return null
}

/** Spreads adults, then children, across rooms in turn so every room has an adult. */
export const toOccupancies = ({ adults, childrenAges, rooms }: StayQuery): Occupancy[] => {
  const occupancies = Array.from({ length: rooms }, () => ({
    adults: 0,
    childrenAges: [] as number[],
  }))
  Array.from({ length: adults }).forEach((_, index) => occupancies[index % rooms]!.adults++)
  childrenAges.forEach((age, index) => occupancies[index % rooms]!.childrenAges.push(age ?? 0))
  return occupancies
}

export const countGuests = ({ adults, childrenAges }: StayQuery) => adults + childrenAges.length
