import { createPinia, setActivePinia } from 'pinia'
import { createApp, type InjectionKey } from 'vue'

export interface Provision<T = unknown> {
  key: InjectionKey<T>
  value: T
}

/** Pairs an injection key with the fake that should answer it. */
export const provision = <T>(key: InjectionKey<T>, value: T): Provision<T> => ({ key, value })

/**
 * Activates a fresh Pinia whose setup stores can `inject` the given fakes.
 * Returns the host app so component tests can reuse its provides.
 */
export const setupPiniaWith = (...provisions: Provision[]) => {
  const app = createApp({})
  provisions.forEach(({ key, value }) => app.provide(key, value))
  const pinia = createPinia()
  app.use(pinia)
  setActivePinia(pinia)
  return { app, pinia }
}
