/** Today's calendar date in the visitor's time zone, `YYYY-MM-DD`. */
export const localToday = (now = new Date()) =>
  [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-')

/** Short day + month, e.g. "10 Nov", for an ISO date read as a calendar day. */
export const formatDay = (isoDate: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(`${isoDate.slice(0, 10)}T00:00:00Z`),
  )

/** Short weekday, e.g. "Fri", for an ISO date read as a calendar day. */
export const formatWeekday = (isoDate: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(
    new Date(`${isoDate.slice(0, 10)}T00:00:00Z`),
  )

/** Date and time in the visitor's zone for an ISO timestamp. */
export const formatDateTime = (isoTimestamp: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(isoTimestamp),
  )
