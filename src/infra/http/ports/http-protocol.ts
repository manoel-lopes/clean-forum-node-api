export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpStatusCode = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 422 | 500

export type HttpRequest<
Body = unknown,
Params = unknown,
Query = unknown> = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponse<Body = Record<string, unknown>> = {
  statusCode: HttpStatusCode
  body?: Body
}
