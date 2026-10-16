import { useI18n } from 'vue-i18n'
import { formatMoney } from 'src/shared/lib/money'
import type { Money } from './types'

/** Formats domain money in the active locale. */
export const useFormatMoney = () => {
  const { locale } = useI18n()
  return ({ amount, currency }: Money) => formatMoney(amount, currency, locale.value)
}
