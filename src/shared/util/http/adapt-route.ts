import type { HttpRequest } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import type { ApiResponse } from '@/infra/http/ports/api'

export function adaptRoute (controller: WebController) {
  return async (req: HttpRequest, res: ApiResponse) => {
    const { statusCode, body } = await controller.handle(req)
    res.code(statusCode).send(body)
  }
}
