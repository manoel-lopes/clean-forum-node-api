import { GetUserByEmailUseCase } from '@/domain/application/usecases/get-user-by-email/get-user-by-email.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { GetUserByEmailController } from '@/presentation/controllers/get-user-by-email/get-user-by-email.controller'

export const makeGetUserByEmailController = () => {
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepository)
  return new GetUserByEmailController(getUserByEmailUseCase)
}
