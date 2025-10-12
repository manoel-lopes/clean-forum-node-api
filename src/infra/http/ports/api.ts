import type {
  HttpRedirectStatusCode,
  HttpRequest,
  HttpStatusCode
} from '@/core/presentation/http'

export type ApiRequest = HttpRequest

export type ApiResponse = {
  code(statusCode: HttpStatusCode): { send(body?: unknown): unknown }
  redirect(url: string, code?: HttpRedirectStatusCode): void
}
