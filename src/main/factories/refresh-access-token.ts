import type { WebController } from '@/core/presentation/web-controller'
import { PrismaRefreshTokensRepository } from '@/infra/persistence/repositories/prisma/prisma-refresh-tokens.repository'
import { RefreshAccessTokenUseCase } from '@/application/usecases/refresh-token/refresh-token.usecase'
import { RefreshAccessTokenController } from '@/presentation/controllers/refresh-token/refresh-token.controller'

export function makeRefreshAccessTokenController (): WebController {
  const refreshTokensRepository = new PrismaRefreshTokensRepository()
  const refreshTokenUseCase = new RefreshAccessTokenUseCase(refreshTokensRepository)
  return new RefreshAccessTokenController(refreshTokenUseCase)
}
