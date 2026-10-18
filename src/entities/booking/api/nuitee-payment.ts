import { loadScript } from 'src/shared/lib/load-script'
import type { PaymentGateway } from '../model/ports'

export const NUITEE_PAYMENT_SCRIPT =
  'https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1'

interface LiteApiPaymentConfig {
  publicKey: 'live' | 'sandbox'
  secretKey: string
  returnUrl: string
  targetElement: string
  appearance?: { theme: string }
  options?: { business: { name: string } }
}

declare global {
  interface Window {
    LiteAPIPayment?: new (config: LiteApiPaymentConfig) => { handlePayment(): void }
  }
}

/** Sandbox keys start with `sand_`; the SDK environment must match the key's. */
export const paymentEnvironmentFor = (apiKey: string) =>
  apiKey.startsWith('sand_') ? 'sandbox' : 'live'

/** Nuitee payment SDK: renders the card form, then redirects to `returnUrl`. */
export const createNuiteePayment = (apiKey: string): PaymentGateway => ({
  mount: async (targetSelector, { secretKey, returnUrl, businessName }) => {
    await loadScript(NUITEE_PAYMENT_SCRIPT)
    if (!window.LiteAPIPayment) throw new Error('LiteAPIPayment SDK unavailable')
    new window.LiteAPIPayment({
      publicKey: paymentEnvironmentFor(apiKey),
      secretKey,
      returnUrl,
      targetElement: targetSelector,
      appearance: { theme: 'flat' },
      options: { business: { name: businessName } },
    }).handlePayment()
  },
})
