import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { RefreshAccessTokenUseCase } from '@/domain/application/usecases/refresh-token/refresh-token.usecase'
import { RefreshAccessTokenController } from '@/presentation/controllers/refresh-token/refresh-token.controller'

export function makeRefreshAccessTokenController (): WebController {
  const refreshTokensRepository = CachedRepositoriesFactory.createRefreshTokensRepository()
  const refreshTokenUseCase = new RefreshAccessTokenUseCase(refreshTokensRepository)
  return new RefreshAccessTokenController(refreshTokenUseCase)
}
