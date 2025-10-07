import type { WebController } from '@/core/presentation/web-controller'
import type { HttpRequest, HttpResponse } from '@/infra/http/ports/http-protocol'
import { ExpiredRefreshTokenError } from '@/domain/application/usecases/refresh-token/errors/expired-refresh-token.error'
import type { RefreshAccessTokenUseCase } from '@/domain/application/usecases/refresh-token/refresh-token.usecase'
import { badRequest, notFound, ok } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export class RefreshAccessTokenController implements WebController {
  constructor (private readonly refreshTokenUseCase: RefreshAccessTokenUseCase) {}

  async handle (req: HttpRequest): Promise<HttpResponse> {
    try {
      const { refreshTokenId } = req.body
      const response = await this.refreshTokenUseCase.execute({ refreshTokenId })
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
