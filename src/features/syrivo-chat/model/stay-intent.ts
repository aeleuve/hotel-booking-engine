import type { StayQuery } from 'src/entities/hotel'

/** DOM event the Syrivo chat widget dispatches when the AI understood a stay. */
export const STAY_INTENT_EVENT = 'syrivo:stay-intent'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const isInt = (value: unknown, min: number): value is number =>
  Number.isInteger(value) && (value as number) >= min

/** Validates the widget's v1 event detail; the availability store re-validates dates. */
export const parseStayIntent = (detail: unknown): StayQuery | null => {
  if (!detail || typeof detail !== 'object') return null
  const { version, checkIn, checkOut, adults, children, rooms } = detail as Record<string, unknown>
  if (version !== 1) return null
  if (typeof checkIn !== 'string' || !ISO_DATE.test(checkIn)) return null
  if (typeof checkOut !== 'string' || !ISO_DATE.test(checkOut)) return null
  if (!isInt(adults, 1) || !isInt(children, 0) || !isInt(rooms, 1)) return null
  return { checkIn, checkOut, adults, children, rooms }
}
