export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 202 | 204 | 400 | 401 | 403 | 404 | 406 | 409 | 413 | 422 | 429 | 500 | 503

export type HttpRedirectStatusCode = 301 | 302

export type HttpHeaders = {
  authorization?: string
}

export type HttpRequest<T extends Partial<{
  body: unknown;
  params: unknown;
  query: unknown
}> = Record<string, never>> =
  & (T extends { body: infer B } ? { body: B } : { body?: unknown })
  & (T extends { params: infer P } ? { params: P } : { params?: unknown })
  & (T extends { query: infer Q } ? { query: Q } : { query?: unknown })
  & { headers?: HttpHeaders; ip?: string }

export type HttpResponse<Body = unknown> = {
  statusCode: HttpStatusCode
  body?: Body
}
