import type { WebController } from '@/core/presentation/web-controller'

import { PasswordHasherStub } from '@/infra/adapters/crypto/stubs/password-hasher.stub'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import { CreateAccountUseCase } from '@/application/usecases/create-account/create-account.usecase'

import { CreateAccountController } from '@/presentation/controllers/create-account/create-account.controller'

export function makeCreateAccountController (): WebController {
  const usersRepository = new InMemoryUsersRepository()
  const passwordHasher = new PasswordHasherStub()
  const createAccountUseCase = new CreateAccountUseCase(usersRepository, passwordHasher)
  return new CreateAccountController(createAccountUseCase)
}
