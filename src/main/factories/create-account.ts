import type { WebController } from '@/core/presentation/web-controller'
import { PasswordHasherStub } from '@/infra/adapters/security/stubs/password-hasher.stub'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CreateAccountUseCase } from '@/application/usecases/create-account/create-account.usecase'
import { CreateAccountController } from '@/presentation/controllers/create-account/create-account.controller'

export function makeCreateAccountController (): WebController {
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const passwordHasher = new PasswordHasherStub()
  const createAccountUseCase = new CreateAccountUseCase(usersRepository, passwordHasher)
  return new CreateAccountController(createAccountUseCase)
}
