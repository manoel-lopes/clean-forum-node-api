import { CreateAccountController } from '@presentation/controllers/create-account/create-account.controller'
import { CreateAccountUseCase } from '@application/usecases/create-account/create-account.usecase'
import { InMemoryUsersRepository } from '@infra/persistence/repositories/in-memory/in-memory-users.repository'
import { PasswordHasherStub } from '@infra/adapters/crypto/stubs/password-hasher.stub'

export function makeCreateAccountController(): CreateAccountController {
  const usersRepository = new InMemoryUsersRepository()
  const passwordHasher = new PasswordHasherStub()
  const createAccountUseCase = new CreateAccountUseCase(usersRepository, passwordHasher)

  return new CreateAccountController(createAccountUseCase)
}
