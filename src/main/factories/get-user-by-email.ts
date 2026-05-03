import { GetUserByEmailUseCase } from '@/domain/application/usecases/get-user-by-email/get-user-by-email.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { GetUserByEmailController } from '@/infra/presentation/controllers/get-user-by-email/get-user-by-email.controller'

export const makeGetUserByEmailController = () => {
  const usersRepo = CachedRepositoriesFactory.createUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepo)
  return new GetUserByEmailController(getUserByEmailUseCase)
}
