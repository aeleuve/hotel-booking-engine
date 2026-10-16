import { defineBoot } from '#q-app/wrappers'
import { readStoredLocale } from 'src/features/switch-locale'
import { createAppI18n } from 'src/shared/i18n'

export default defineBoot(({ app }) => {
  const locale = readStoredLocale(navigator.languages)
  document.documentElement.lang = locale
  app.use(createAppI18n(locale))
})
