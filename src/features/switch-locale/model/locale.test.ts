import { afterEach, describe, expect, it } from 'vitest'
import { readStoredLocale, storeLocale } from './locale'

describe('locale', () => {
  afterEach(() => localStorage.clear())

  it('prefers the saved locale', () => {
    storeLocale('de')
    expect(readStoredLocale(['fr-FR'])).toBe('de')
    expect(document.documentElement.lang).toBe('de')
  })

  it('falls back to the first supported browser language', () => {
    expect(readStoredLocale(['pt-BR', 'es-ES', 'en'])).toBe('es')
  })

  it('defaults to English', () => {
    expect(readStoredLocale(['ja'])).toBe('en')
  })
})
