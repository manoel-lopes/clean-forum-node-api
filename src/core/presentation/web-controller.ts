import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'

export type WebController = {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
