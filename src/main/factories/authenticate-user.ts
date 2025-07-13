import type { WebController } from '@/core/presentation/web-controller'
import { PasswordHasherStub } from '@/infra/adapters/crypto/stubs/password-hasher.stub'
import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { AuthenticateUserUseCase } from '@/application/usecases/authenticate-user/authenticate-user.usecase'
import { AuthenticateUserController } from '@/presentation/controllers/authenticate-user/authenticate-user.controller'

export function makeAuthenticateUserController (): WebController {
  const usersRepository = new PrismaUsersRepository()
  const passwordHasher = new PasswordHasherStub()
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository, passwordHasher)
  return new AuthenticateUserController(authenticateUserUseCase)
}
