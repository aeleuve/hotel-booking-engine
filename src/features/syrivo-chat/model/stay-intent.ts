import { MAX_ADULTS, MAX_CHILD_AGE, MAX_CHILDREN, type StayQuery } from 'src/entities/hotel'

/** DOM event the Syrivo chat widget dispatches when the AI understood a stay. */
export const STAY_INTENT_EVENT = 'syrivo:stay-intent'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const isInt = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max

/** Uses the ages the widget sent when they match `children`; otherwise leaves them for the guest to pick. */
const toChildrenAges = (children: number, ages: unknown): (number | null)[] =>
  Array.isArray(ages) &&
  ages.length === children &&
  ages.every((age) => isInt(age, 0, MAX_CHILD_AGE))
    ? ages
    : Array.from({ length: children }, () => null)

/**
 * Validates the widget's v1 event detail against the booking form's own guest
 * limits (rooms never exceed adults); the availability store re-validates dates.
 */
export const parseStayIntent = (detail: unknown): StayQuery | null => {
  if (!detail || typeof detail !== 'object') return null
  const { version, checkIn, checkOut, adults, children, childrenAges, rooms } = detail as Record<
    string,
    unknown
  >
  if (version !== 1) return null
  if (typeof checkIn !== 'string' || !ISO_DATE.test(checkIn)) return null
  if (typeof checkOut !== 'string' || !ISO_DATE.test(checkOut)) return null
  if (!isInt(adults, 1, MAX_ADULTS) || !isInt(children, 0, MAX_CHILDREN)) return null
  if (!isInt(rooms, 1, adults)) return null
  return { checkIn, checkOut, adults, childrenAges: toChildrenAges(children, childrenAges), rooms }
}
