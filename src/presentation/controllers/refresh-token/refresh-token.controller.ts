import type { WebController } from '@/core/presentation/web-controller'
import type { UseCase } from '@/core/application/use-case'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ExpiredRefreshTokenError } from '@/application/usecases/refresh-token/errors/expired-refresh-token.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { badRequest, notFound, ok } from '@/presentation/helpers/http-helpers'

export class RefreshAccessTokenController implements WebController {
  constructor (private readonly refreshAccessTokenUseCase: UseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { refreshTokenId } = req.body
      const response = await this.refreshAccessTokenUseCase.execute({ refreshTokenId })
      return ok(response)
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return notFound(error)
      }
      if (error instanceof ExpiredRefreshTokenError) {
        return badRequest(error)
      }
      throw error
    }
  }
}
