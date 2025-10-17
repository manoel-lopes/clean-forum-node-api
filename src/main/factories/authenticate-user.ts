import type { WebController } from '@/core/presentation/web-controller'
import { AuthenticateUserUseCase } from '@/domain/application/usecases/authenticate-user/authenticate-user.usecase'
import { BcryptPasswordHasher } from '@/infra/adapters/security/bcrypt-password-hasher'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { AuthenticateUserController } from '@/presentation/controllers/authenticate-user/authenticate-user.controller'

export function makeAuthenticateUserController(): WebController {
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const passwordHasher = new BcryptPasswordHasher()
  const refreshTokensRepository = CachedRepositoriesFactory.createRefreshTokensRepository()
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository, passwordHasher, refreshTokensRepository)
  return new AuthenticateUserController(authenticateUserUseCase)
}
