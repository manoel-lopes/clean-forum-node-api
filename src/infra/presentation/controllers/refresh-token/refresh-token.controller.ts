import type { z } from 'zod'
import type { HttpRequest, HttpResponse } from '@/core/presentation/http-protocol'
import type { WebController } from '@/core/presentation/web-controller'
import { ExpiredRefreshTokenError } from '@/domain/application/usecases/refresh-token/errors/expired-refresh-token.error'
import type { RefreshAccessTokenUseCase } from '@/domain/application/usecases/refresh-token/refresh-token.usecase'
import { badRequest, notFound, ok } from '@/infra/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type { refreshTokenBodySchema } from './schemas/refresh-token.protocol'

export class RefreshAccessTokenController implements WebController {
  constructor (private readonly refreshTokenUseCase: RefreshAccessTokenUseCase) {}

  async handle (req: HttpRequest<{
    body: z.infer<typeof refreshTokenBodySchema>
  }>): Promise<HttpResponse> {
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
