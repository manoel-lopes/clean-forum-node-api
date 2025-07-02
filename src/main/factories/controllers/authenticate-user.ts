import {
  AuthenticateUserController
} from '@presentation/controllers/authenticate-user/authenticate-user.controller'
import {
  AuthenticateUserUseCase
} from '@application/usecases/authenticate-user/authenticate-user.usecase'
import {
  InMemoryUsersRepository
} from '@infra/persistence/repositories/in-memory/in-memory-users.repository'
import { PasswordHasherStub } from '@infra/adapters/crypto/stubs/password-hasher.stub'

export function makeAuthenticateUserController (): AuthenticateUserController {
  const usersRepository = new InMemoryUsersRepository()
  const passwordHasher = new PasswordHasherStub()
  const authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository, passwordHasher)

  return new AuthenticateUserController(authenticateUserUseCase)
}
