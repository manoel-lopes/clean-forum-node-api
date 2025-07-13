import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { GetUserByEmailUseCase } from '@/application/usecases/get-user-by-email/get-user-by-email.usecase'
import { GetUserByEmailController } from '@/presentation/controllers/get-user-by-email/get-user-by-email.controller'

export const makeGetUserByEmailController = () => {
  const usersRepository = new PrismaUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepository)
  return new GetUserByEmailController(getUserByEmailUseCase)
}
