export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 202 | 204 | 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500 | 503

export type HttpRedirectStatusCode = 301 | 302

export type HttpHeaders = {
  authorization?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpRequest<Body = any, Params = any, Query = any> = {
  body?: Body
  params?: Params
  query?: Query
  headers?: HttpHeaders
  ip?: string
}

export type HttpResponse<Body = unknown> = {
  statusCode: HttpStatusCode
  body?: Body
}
