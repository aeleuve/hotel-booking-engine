/** JSON value in `sessionStorage` that degrades to memory-less no-ops when storage is blocked. */
export const createSessionStore = <T>(key: string) => ({
  read: (): T | null => {
    try {
      const raw = sessionStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },
  write: (value: T) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage blocked: the value lives only in memory for this page view.
    }
  },
  clear: () => {
    try {
      sessionStorage.removeItem(key)
    } catch {
      // Nothing to clear.
    }
  },
})
