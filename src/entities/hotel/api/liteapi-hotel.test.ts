import { describe, expect, it, vi } from 'vitest'
import { HttpError, type HttpClient } from 'src/shared/api/http-client'
import { defaultStay } from '../model/stay'
import { createLiteApiHotel } from './liteapi-hotel'
import { NO_AVAILABILITY_CODE } from './liteapi-hotel-rows'
import { hotelDetailsFixture, reviewsFixture } from './mock-liteapi-fixtures'

const fakeHttp = (post: HttpClient['post']): HttpClient => ({
  get: vi.fn((path: string) =>
    Promise.resolve(path === '/data/hotel' ? hotelDetailsFixture : reviewsFixture),
  ) as HttpClient['get'],
  post,
  put: vi.fn() as HttpClient['put'],
})

describe('liteapi hotel adapter', () => {
  it('loads hotel details once for profile and rooms', async () => {
    const http = fakeHttp(vi.fn() as HttpClient['post'])
    const repository = createLiteApiHotel(http, {
      hotelId: 'lp42e6e',
      nationality: () => 'ES',
      language: () => 'en',
    })

    await Promise.all([repository.getProfile(), repository.listRooms()])

    expect(http.get).toHaveBeenCalledTimes(1)
    expect(http.get).toHaveBeenCalledWith('/data/hotel', { hotelId: 'lp42e6e', language: 'en' })
  })

  it('retries hotel details after a failure', async () => {
    const http = fakeHttp(vi.fn() as HttpClient['post'])
    vi.mocked(http.get).mockRejectedValueOnce(new HttpError(0, '/data/hotel'))
    const repository = createLiteApiHotel(http, {
      hotelId: 'lp42e6e',
      nationality: () => 'ES',
      language: () => 'en',
    })

    await expect(repository.getProfile()).rejects.toBeInstanceOf(HttpError)
    await expect(repository.getProfile()).resolves.toMatchObject({ name: 'Hotel Pista Siete' })
  })

  it('searches rates with the current nationality', async () => {
    const post = vi.fn(() => Promise.resolve({ data: [] })) as unknown as HttpClient['post']
    const repository = createLiteApiHotel(fakeHttp(post), {
      hotelId: 'lp42e6e',
      nationality: () => 'DE',
      language: () => 'de',
    })

    await repository.checkAvailability(defaultStay('2026-11-10'))

    expect(post).toHaveBeenCalledWith(
      '/hotels/rates',
      expect.objectContaining({ guestNationality: 'DE' }),
    )
  })

  it('turns "no availability" into an empty result', async () => {
    const post = vi.fn(() =>
      Promise.reject(new HttpError(200, '/hotels/rates', NO_AVAILABILITY_CODE)),
    ) as unknown as HttpClient['post']
    const repository = createLiteApiHotel(fakeHttp(post), {
      hotelId: 'lp42e6e',
      nationality: () => 'ES',
      language: () => 'en',
    })

    await expect(repository.checkAvailability(defaultStay('2026-11-10'))).resolves.toMatchObject({
      offers: [],
    })
  })

  it('rethrows other errors', async () => {
    const post = vi.fn(() =>
      Promise.reject(new HttpError(500, '/hotels/rates')),
    ) as unknown as HttpClient['post']
    const repository = createLiteApiHotel(fakeHttp(post), {
      hotelId: 'lp42e6e',
      nationality: () => 'ES',
      language: () => 'en',
    })

    await expect(repository.checkAvailability(defaultStay('2026-11-10'))).rejects.toBeInstanceOf(
      HttpError,
    )
  })
})
