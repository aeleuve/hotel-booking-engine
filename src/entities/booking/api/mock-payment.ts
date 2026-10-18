import type { PaymentGateway } from '../model/ports'

/** Offline gateway: one button that behaves like a successful card payment. */
export const createMockPayment = (
  navigate: (url: string) => void = (url) => window.location.assign(url),
): PaymentGateway => ({
  mount: (targetSelector, { returnUrl, payLabel }) => {
    const target = document.querySelector(targetSelector)
    if (!target) return Promise.reject(new Error(`Payment target ${targetSelector} not found`))
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'mock-payment__button'
    button.textContent = payLabel
    button.addEventListener('click', () => navigate(returnUrl))
    target.replaceChildren(button)
    return Promise.resolve()
  },
})
