import { createI18n } from 'vue-i18n'
import de from './locales/de'
import en from './locales/en'
import es from './locales/es'
import fr from './locales/fr'
import type { MessageSchema } from './schema'

export const SUPPORTED_LOCALES = ['en', 'es', 'de', 'fr'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_NAMES: Record<AppLocale, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
}

export const isAppLocale = (value: unknown): value is AppLocale =>
  SUPPORTED_LOCALES.includes(value as AppLocale)

export const messages: Record<AppLocale, MessageSchema> = { en, es, de, fr }

export const createAppI18n = (locale: AppLocale = 'en') =>
  createI18n<[MessageSchema], AppLocale, false>({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages,
  })

export type { MessageSchema }
