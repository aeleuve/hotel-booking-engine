import { describe, expect, it, vi } from 'vitest'
import { createJsonHttp, HttpError } from './http-client'

const respond = (status: number, body: unknown) =>
  vi.fn(() => Promise.resolve(new Response(JSON.stringify(body), { status })))

describe('createJsonHttp', () => {
  it('sends JSON with default headers and query params', async () => {
    const fetcher = respond(200, { data: 1 })
    const http = createJsonHttp('https://api.test/v3.0/', {
      headers: { 'X-API-Key': 'k' },
      fetcher,
    })

    await expect(http.post('/rates', { a: 1 }, { timeout: 4 })).resolves.toEqual({ data: 1 })

    const [url, init] = fetcher.mock.calls[0] as unknown as [URL, RequestInit]
    expect(url.toString()).toBe('https://api.test/v3.0/rates?timeout=4')
    expect(init.method).toBe('POST')
    expect(init.body).toBe('{"a":1}')
    expect(init.headers).toMatchObject({ 'X-API-Key': 'k', 'Content-Type': 'application/json' })
  })

  it('raises the API error code even on 200', async () => {
    const http = createJsonHttp('https://api.test', {
      fetcher: respond(200, { error: { code: 2001, message: 'no availability found' } }),
    })
    await expect(http.get('/x')).rejects.toMatchObject({ code: 2001, status: 200 })
  })

  it('raises HttpError on non-2xx', async () => {
    const http = createJsonHttp('https://api.test', { fetcher: respond(401, {}) })
    await expect(http.get('/x')).rejects.toBeInstanceOf(HttpError)
  })
})
