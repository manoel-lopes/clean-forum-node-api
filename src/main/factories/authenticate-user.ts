import type { WebController } from '@/core/presentation/web-controller'
import { PasswordHasherStub } from '@/infra/adapters/security/stubs/password-hasher.stub'
import { PrismaRefreshTokensRepository } from '@/infra/persistence/repositories/prisma/prisma-refresh-tokens.repository'
import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { AuthenticateUserUseCase } from '@/application/usecases/authenticate-user/authenticate-user.usecase'
import { AuthenticateUserController } from '@/presentation/controllers/authenticate-user/authenticate-user.controller'

export function makeAuthenticateUserController (): WebController {
  const usersRepository = new PrismaUsersRepository()
  const passwordHasher = new PasswordHasherStub()
  const refreshTokensRepository = new PrismaRefreshTokensRepository()
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository, passwordHasher, refreshTokensRepository)
  return new AuthenticateUserController(authenticateUserUseCase)
}
