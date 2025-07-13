import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { FetchUsersController } from '@/presentation/controllers/fetch-users/fetch-users.controller'

export const makeFetchUsersController = (): FetchUsersController => {
  const usersRepository = new PrismaUsersRepository()
  const fetchUsersController = new FetchUsersController(usersRepository)
  return fetchUsersController
}
