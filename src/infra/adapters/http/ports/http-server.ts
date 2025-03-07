import type { HttpRequest, HttpStatusCode } from '@/infra/http/ports/http-protocol'

export type ApiRequest = HttpRequest

export type ApiResponse = {
  code(statusCode: HttpStatusCode): { send(body?: unknown): unknown }
}

export type HttpRequestSchema<Body = unknown, Params = unknown, Query = unknown> = {
  body?: Body
  params?: Params
  query?: Query
}

export type HttpResponseSchema = Partial<Record<HttpStatusCode, unknown>>

export type RouteSchema = {
  tags?: string[]
  description?: string
  headers?: unknown
  summary?: string
  request?: HttpRequestSchema
  response?: HttpResponseSchema
}

export type RouteOptions = {
  schema?: RouteSchema
}

export type Middleware = (
  req: ApiRequest,
  res: ApiResponse,
  next?: () => void
) => Promise<unknown> | unknown

export type ListenOptions = { port: number, host?: string }

export type ErrorHandler = (error: Error, req: ApiRequest, res: ApiResponse) => void

export type HttpServer = {
  get(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  post(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  put(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  patch(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  delete(url: string, options: RouteOptions, ...handlers: Middleware[]): void
  listen(options?: ListenOptions): Promise<void>
  register(setupRoute: (app: HttpServer) => void): void
  close(): Promise<void>
  setErrorHandler(errorHandler: ErrorHandler): void
}
