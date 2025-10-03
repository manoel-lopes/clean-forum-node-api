import type { FastifyInstance } from 'fastify'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import {
  getUserByEmailQuerySchema,
  getUserByEmailResponsesSchema
} from '@/infra/validation/zod/schemas/presentation/users/get-user-by-email.schemas'
import { GetUserByEmailUseCase } from '@/application/usecases/get-user-by-email/get-user-by-email.usecase'
import { GetUserByEmailController } from '@/presentation/controllers/get-user-by-email/get-user-by-email.controller'
import { adaptRoute } from '@/shared/util/http/adapt-route'

export async function getUserByEmailRoute (app: FastifyInstance, tags: string[]) {
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const getUserByEmailUseCase = new GetUserByEmailUseCase(usersRepository)
  const getUserByEmailController = new GetUserByEmailController(getUserByEmailUseCase)
  app.get('/:email', {
    schema: {
      tags,
      description: 'Get user by email',
      params: getUserByEmailQuerySchema,
      response: getUserByEmailResponsesSchema
    }
  },
  adaptRoute(getUserByEmailController)
  )
}
