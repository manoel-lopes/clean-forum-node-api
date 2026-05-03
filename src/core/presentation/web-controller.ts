import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'

export interface WebController {
  handle(req: HttpRequest): Promise<HttpResponse>
}
