import type {
  HttpRedirectStatusCode,
  HttpRequest,
  HttpStatusCode
} from '@/infra/http/ports/http-protocol'
import type { SchemaParseResult } from '@/infra/validation/ports/schema-parse-result'

export type ApiRequest = HttpRequest

export type ApiResponse = {
  code(statusCode: HttpStatusCode): { send(body?: unknown): unknown }
  redirect(url: string, code?: HttpRedirectStatusCode): void
}

export type SchemaParser<T = unknown> = (schema: T, data: unknown) => SchemaParseResult
