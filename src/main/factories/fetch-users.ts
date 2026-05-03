import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchUsersController } from '@/infra/presentation/controllers/fetch-users/fetch-users.controller'

export const makeFetchUsersController = (): FetchUsersController => {
  const usersRepo = CachedRepositoriesFactory.createUsersRepository()
  const fetchUsersController = new FetchUsersController(usersRepo)
  return fetchUsersController
}
