import {
  MAX_ADULTS,
  MAX_CHILD_AGE,
  MAX_CHILDREN,
  type FlexibleStay,
  type StayQuery,
} from 'src/entities/hotel'

/** DOM event the Syrivo chat widget dispatches when the guest asks for the best price in a month. */
export const STAY_SEARCH_EVENT = 'syrivo:stay-search'

export interface StaySearchRequest {
  stay: FlexibleStay
  guests: Pick<StayQuery, 'adults' | 'childrenAges' | 'rooms'>
  roomType?: string
}

export type StaySearchParse =
  { ok: true; request: StaySearchRequest } | { ok: false; reason: 'malformed' | 'too-many-guests' }

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/
const MAX_NIGHTS = 14
const MALFORMED = { ok: false, reason: 'malformed' } as const

const isInt = (value: unknown, min: number, max: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= max

/**
 * Validates the widget's v1 stay-search detail. Shape errors are `malformed`;
 * a well-formed request beyond the booking form's guest limits is `too-many-guests`.
 */
export const parseStaySearch = (detail: unknown): StaySearchParse => {
  if (!detail || typeof detail !== 'object') return MALFORMED
  const { version, month, nights, checkInDay, adults, children, childrenAges, rooms, roomType } =
    detail as Record<string, unknown>
  if (version !== 1) return MALFORMED
  if (typeof month !== 'string' || !MONTH.test(month)) return MALFORMED
  if (!isInt(nights, 1, MAX_NIGHTS)) return MALFORMED
  if (checkInDay !== 'friday' && checkInDay !== null) return MALFORMED
  if (!isInt(adults, 1, Infinity) || !isInt(children, 0, Infinity)) return MALFORMED
  if (!Array.isArray(childrenAges) || childrenAges.length !== children) return MALFORMED
  if (!childrenAges.every((age) => isInt(age, 0, MAX_CHILD_AGE))) return MALFORMED
  if (!isInt(rooms, 1, adults)) return MALFORMED
  if (roomType !== undefined && typeof roomType !== 'string') return MALFORMED
  if (adults > MAX_ADULTS || children > MAX_CHILDREN)
    return { ok: false, reason: 'too-many-guests' }
  return {
    ok: true,
    request: {
      stay: { month, nights, checkInDay },
      guests: { adults, childrenAges, rooms },
      ...(roomType ? { roomType } : {}),
    },
  }
}
