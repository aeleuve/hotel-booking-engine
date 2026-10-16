export type QueryParams = Record<string, string | number>

/** Minimal GET contract adapters depend on, so tests can pass a fake. */
export type HttpGet = <T>(path: string, params: QueryParams) => Promise<T>

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
  ) {
    super(`GET ${url} failed with ${status}`)
  }
}

export const createFetchHttp =
  (baseUrl: string, fetcher: typeof fetch = fetch): HttpGet =>
  async <T>(path: string, params: QueryParams) => {
    const url = new URL(path, baseUrl)
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)))
    const response = await fetcher(url)
    if (!response.ok) throw new HttpError(response.status, url.pathname)
    return (await response.json()) as T
  }
