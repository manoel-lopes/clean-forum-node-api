import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'

export type WebController = {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
