/** Today's calendar date in the visitor's time zone, `YYYY-MM-DD`. */
export const localToday = (now = new Date()) =>
  [now.getFullYear(), now.getMonth() + 1, now.getDate()]
    .map((part) => String(part).padStart(2, '0'))
    .join('-')
