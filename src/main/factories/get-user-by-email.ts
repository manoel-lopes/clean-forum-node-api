import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import { GetUserByEmailUseCase } from '@/application/usecases/get-user-by-email/get-user-by-email.usecase'

import { GetUserByEmailController } from '@/presentation/controllers/get-user-by-email/get-user-by-email.controller'

export const makeGetUserByEmailController = () => {
  const usersRepository = new InMemoryUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepository)
  return new GetUserByEmailController(getUserByEmailUseCase)
}
