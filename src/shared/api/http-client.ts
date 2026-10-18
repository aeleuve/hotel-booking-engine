export type QueryParams = Record<string, string | number | boolean>

/** JSON client contract adapters depend on, so tests can pass a fake. */
export interface HttpClient {
  get<T>(path: string, params?: QueryParams): Promise<T>
  post<T>(path: string, body: unknown, params?: QueryParams): Promise<T>
  put<T>(path: string, body?: unknown, params?: QueryParams): Promise<T>
}

interface ApiErrorBody {
  error?: { code?: number; message?: string }
}

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly url: string,
    readonly code: number | null = null,
    detail = '',
  ) {
    super(`${url} failed with ${status}${detail ? `: ${detail}` : ''}`)
  }
}

interface HttpOptions {
  headers?: Record<string, string>
  fetcher?: typeof fetch
}

const buildUrl = (baseUrl: string, path: string, params: QueryParams = {}) => {
  const url = new URL(`${baseUrl.replace(/\/$/, '')}${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)))
  return url
}

const readJson = async (response: Response): Promise<unknown> => {
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

/** Throws `HttpError` for non-2xx answers and for 2xx bodies carrying `{ error }`. */
const parseResponse = async <T>(response: Response, url: URL): Promise<T> => {
  const body = (await readJson(response)) as (ApiErrorBody & T) | null
  const apiError = body?.error
  if (!response.ok || apiError) {
    throw new HttpError(response.status, url.pathname, apiError?.code ?? null, apiError?.message)
  }
  return body as T
}

export const createJsonHttp = (
  baseUrl: string,
  { headers = {}, fetcher = fetch }: HttpOptions = {},
): HttpClient => {
  const send = async <T>(method: string, path: string, body?: unknown, params?: QueryParams) => {
    const url = buildUrl(baseUrl, path, params)
    const response = await fetcher(url, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...headers },
      body: body === undefined ? null : JSON.stringify(body),
    })
    return parseResponse<T>(response, url)
  }
  return {
    get: (path, params) => send('GET', path, undefined, params),
    post: (path, body, params) => send('POST', path, body, params),
    put: (path, body, params) => send('PUT', path, body, params),
  }
}
