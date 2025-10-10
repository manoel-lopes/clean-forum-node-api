import type { HttpRequest, HttpResponse } from '@/core/presentation/http'

export type WebController = {
  handle: (req: HttpRequest) => Promise<HttpResponse>
}
