import { FallbackController } from '@/infra/http/fallback/fallback.controller'
import type { ApiRequest, ApiResponse } from '@/infra/http/ports/api'

export function errorHandlerFactory(error: Error, req: ApiRequest, res: ApiResponse) {
  return FallbackController.handle(error, req, res)
}
