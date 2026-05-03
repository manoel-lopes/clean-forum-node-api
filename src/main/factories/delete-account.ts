import type { WebController } from '@/core/presentation/web-controller'
import { DeleteAccountUseCase } from '@/domain/application/usecases/delete-account/delete-account.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteAccountController } from '@/infra/presentation/controllers/delete-account/delete-account.controller'

export function makeDeleteAccountController (): WebController {
  const usersRepo = CachedRepositoriesFactory.createUsersRepository()
  const refreshTokensRepository = CachedRepositoriesFactory.createRefreshTokensRepository()
  const deleteAccountUseCase = new DeleteAccountUseCase(usersRepo, refreshTokensRepository)
  return new DeleteAccountController(deleteAccountUseCase)
}
