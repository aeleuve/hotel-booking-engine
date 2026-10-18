const pending = new Map<string, Promise<void>>()

/** Injects a script tag once per URL and resolves when it has loaded. */
export const loadScript = (src: string): Promise<void> => {
  const existing = pending.get(src)
  if (existing) return existing
  const loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      pending.delete(src)
      reject(new Error(`Script failed to load: ${src}`))
    }
    document.head.append(script)
  })
  pending.set(src, loading)
  return loading
}
