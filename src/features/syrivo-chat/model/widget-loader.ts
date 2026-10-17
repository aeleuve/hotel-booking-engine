/** Where the Syrivo chat widget is served from and which workspace it talks to. */
export interface SyrivoWidgetConfig {
  apiUrl: string
  tenant: string
}

const TENANT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const WIDGET_SCRIPT_PATH = '/widget/v1/syrivo-widget.js'

const normalizeApiUrl = (value: string): string | null => {
  try {
    const url = new URL(value)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (url.search || url.hash || url.username || url.password) return null
    return url.href.replace(/\/+$/, '')
  } catch {
    return null
  }
}

/**
 * Reads the widget settings from the build env. Missing or invalid values
 * return null, so the site simply runs without the chat.
 */
export const readSyrivoWidgetConfig = (
  apiUrl: string | undefined,
  tenant: string | undefined,
): SyrivoWidgetConfig | null => {
  const normalizedUrl = apiUrl?.trim() ? normalizeApiUrl(apiUrl.trim()) : null
  const slug = tenant?.trim() ?? ''
  if (!normalizedUrl || !TENANT_SLUG.test(slug)) return null
  return { apiUrl: normalizedUrl, tenant: slug }
}

/** Adds the widget script and its `<syrivo-chat>` element to the page once. */
export const mountSyrivoWidget = (config: SyrivoWidgetConfig, doc: Document = document): void => {
  if (doc.querySelector('syrivo-chat')) return
  const script = doc.createElement('script')
  script.src = `${config.apiUrl}${WIDGET_SCRIPT_PATH}`
  script.defer = true
  const chat = doc.createElement('syrivo-chat')
  chat.setAttribute('tenant', config.tenant)
  chat.setAttribute('api', config.apiUrl)
  doc.body.append(script, chat)
}
