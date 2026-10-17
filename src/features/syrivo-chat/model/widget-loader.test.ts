import { afterEach, describe, expect, it } from 'vitest'
import { mountSyrivoWidget, readSyrivoWidgetConfig } from './widget-loader'

describe('readSyrivoWidgetConfig', () => {
  it('accepts an http(s) origin and a workspace slug, dropping trailing slashes', () => {
    expect(readSyrivoWidgetConfig(' https://chat.example.com/ ', 'hotel-pista-siete')).toEqual({
      apiUrl: 'https://chat.example.com',
      tenant: 'hotel-pista-siete',
    })
    expect(readSyrivoWidgetConfig('http://localhost:3000', 'hotel')).toEqual({
      apiUrl: 'http://localhost:3000',
      tenant: 'hotel',
    })
  })

  it('keeps a path prefix for a server behind a sub-path', () => {
    expect(readSyrivoWidgetConfig('https://example.com/syrivo/', 'hotel')?.apiUrl).toBe(
      'https://example.com/syrivo',
    )
  })

  it.each([
    [undefined, 'hotel'],
    ['', 'hotel'],
    ['https://chat.example.com', undefined],
    ['https://chat.example.com', ''],
    ['not a url', 'hotel'],
    ['javascript:alert(1)', 'hotel'],
    ['ftp://chat.example.com', 'hotel'],
    ['https://chat.example.com?x=1', 'hotel'],
    ['https://user:pass@chat.example.com', 'hotel'],
    ['https://chat.example.com', 'Hotel Pista'],
    ['https://chat.example.com', '"><script>'],
  ])('returns null for api %s and tenant %s', (apiUrl, tenant) => {
    expect(readSyrivoWidgetConfig(apiUrl, tenant)).toBeNull()
  })
})

describe('mountSyrivoWidget', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('adds the deferred script and the chat element pointing at the server', () => {
    mountSyrivoWidget({ apiUrl: 'https://chat.example.com', tenant: 'hotel-pista-siete' })
    const script = document.querySelector('script')
    const chat = document.querySelector('syrivo-chat')
    expect(script?.src).toBe('https://chat.example.com/widget/v1/syrivo-widget.js')
    expect(script?.defer).toBe(true)
    expect(chat?.getAttribute('tenant')).toBe('hotel-pista-siete')
    expect(chat?.getAttribute('api')).toBe('https://chat.example.com')
  })

  it('does nothing when the widget is already on the page', () => {
    const config = { apiUrl: 'https://chat.example.com', tenant: 'hotel' }
    mountSyrivoWidget(config)
    mountSyrivoWidget(config)
    expect(document.querySelectorAll('syrivo-chat')).toHaveLength(1)
    expect(document.querySelectorAll('script')).toHaveLength(1)
  })
})
