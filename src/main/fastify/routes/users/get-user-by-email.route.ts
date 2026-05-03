import type { FastifyInstance } from 'fastify'
import { GetUserByEmailUseCase } from '@/domain/application/usecases/get-user-by-email/get-user-by-email.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { GetUserByEmailController } from '@/infra/presentation/controllers/get-user-by-email/get-user-by-email.controller'
import {
  getUserByEmailQuerySchema,
  getUserByEmailResponsesSchema,
} from '@/infra/presentation/controllers/get-user-by-email/schemas/get-user-by-email.protocol'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function getUserByEmailRoute (app: FastifyInstance, tags: string[]) {
  const usersRepo = CachedRepositoriesFactory.createUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepo)
  const getUserByEmailController = new GetUserByEmailController(getUserByEmailUseCase)
  app.get(
    '/:email',
    {
      schema: {
        tags,
        description: 'Get user by email',
        params: getUserByEmailQuerySchema,
        response: getUserByEmailResponsesSchema,
      },
    },
    adaptRoute(getUserByEmailController)
  )
}
