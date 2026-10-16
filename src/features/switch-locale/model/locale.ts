import { isAppLocale, type AppLocale } from 'src/shared/i18n'

const STORAGE_KEY = 'pista-siete:locale'

const readStorage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** Saved choice first, then the browser's preferred languages, then English. */
export const readStoredLocale = (browserLanguages: readonly string[]): AppLocale => {
  const candidates = [readStorage(), ...browserLanguages.map((tag) => tag.slice(0, 2))]
  return candidates.find(isAppLocale) ?? 'en'
}

export const storeLocale = (locale: AppLocale) => {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // Private mode: the choice lasts for this page view only.
  }
  document.documentElement.lang = locale
}
