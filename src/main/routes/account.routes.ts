import { FastifyInstance } from 'fastify'
import { makeAuthenticateUserController } from '@main/factories/controllers/authenticate-user'
import { makeCreateAccountController } from '@main/factories/controllers/create-account'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  authenticateUserSchema,
  authenticateUserResponsesSchema
} from '@external/zod/application/schemas/account/authenticate-user.schema'
import {
  createAccountSchema,
  createAccountResponsesSchema
} from '@external/zod/application/schemas/account/create-account.schema'
import { errorResponseSchema } from '@external/zod/application/schemas/core/error-response.schema'

export async function accountRoutes (app: FastifyInstance): Promise<void> {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions',
    {
      schema: {
        tags: ['Account'],
        summary: 'Authenticate a user',
        body: authenticateUserSchema,
        response: {
          200: authenticateUserResponsesSchema,
          401: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await makeAuthenticateUserController().handle({
        body: request.body,
      })

      return reply.status(200).send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['Account'],
        summary: 'Create an account',
        body: createAccountSchema,
        response: {
          201: createAccountResponsesSchema,
          409: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      await makeCreateAccountController().handle({
        body: request.body,
      })

      return reply.status(201).send()
    }
  )
}
