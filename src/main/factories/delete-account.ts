import type { WebController } from '@/core/presentation/web-controller'
import { PrismaRefreshTokensRepository } from '@/infra/persistence/repositories/prisma/prisma-refresh-tokens.repository'
import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { DeleteAccountUseCase } from '@/application/usecases/delete-account/delete-account.usecase'
import { DeleteAccountController } from '@/presentation/controllers/delete-account/delete-account.controller'

export function makeDeleteAccountController (): WebController {
  const usersRepository = new PrismaUsersRepository()
  const refreshTokensRepository = new PrismaRefreshTokensRepository()
  const deleteAccountUseCase = new DeleteAccountUseCase(usersRepository, refreshTokensRepository)
  return new DeleteAccountController(deleteAccountUseCase)
}
