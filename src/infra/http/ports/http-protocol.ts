export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type HttpRedirectStatusCode = 301 | 302

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpRequest<Body = any, Params = any, Query = any> = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponse<Body = unknown> = {
  statusCode: HttpStatusCode
  body?: Body
}
