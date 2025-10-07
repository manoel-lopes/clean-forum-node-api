import { ErrorHandler } from '@/infra/http/middlewares/error-handler'
import type { ApiRequest, ApiResponse } from '@/infra/http/ports/api'

export function errorHandlerFactory (error: Error, req: ApiRequest, res: ApiResponse) {
  return ErrorHandler.handle(error, req, res)
}
