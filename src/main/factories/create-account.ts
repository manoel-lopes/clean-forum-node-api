import type { WebController } from '@/core/presentation/web-controller'
import { CreateAccountUseCase } from '@/domain/application/usecases/create-account/create-account.usecase'
import { BcryptPasswordHasher } from '@/infra/adapters/security/bcrypt-password-hasher'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CreateAccountController } from '@/presentation/controllers/create-account/create-account.controller'

export function makeCreateAccountController (): WebController {
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const passwordHasher = new BcryptPasswordHasher()
  const createAccountUseCase = new CreateAccountUseCase(usersRepository, passwordHasher)
  return new CreateAccountController(createAccountUseCase)
}
