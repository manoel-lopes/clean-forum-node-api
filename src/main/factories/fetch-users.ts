import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchUsersController } from '@/presentation/controllers/fetch-users/fetch-users.controller'

export const makeFetchUsersController = (): FetchUsersController => {
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const fetchUsersController = new FetchUsersController(usersRepository)
  return fetchUsersController
}
