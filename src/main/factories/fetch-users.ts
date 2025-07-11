import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'

import { FetchUsersUseCase } from '@/application/usecases/fetch-users/fetch-users.usecase'

import { FetchUsersController } from '@/presentation/controllers/fetch-users/fetch-users.controller'

export const makeFetchUsersController = (): FetchUsersController => {
  const usersRepository = new PrismaUsersRepository()
  const fetchUsersUseCase = new FetchUsersUseCase(usersRepository)
  const fetchUsersController = new FetchUsersController(fetchUsersUseCase)
  return fetchUsersController
}
