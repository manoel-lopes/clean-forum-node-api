import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { badRequest, ok } from '@/presentation/helpers/http-helpers'

export class RefreshAccessTokenController implements WebController {
  constructor (private readonly refreshAccessTokenUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { refreshTokenId } = req.body
      const response = await this.refreshAccessTokenUseCase.execute({ refreshTokenId })
      return ok(response)
    } catch (error) {
      return badRequest(error)
    }
  }
}
