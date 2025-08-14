import type { FastifyInstance } from 'fastify'
import { refreshAccessTokenBodySchema, refreshAccessTokenResponseSchema } from '@/infra/validation/zod/schemas/presentation/sessions/refresh-tokens.schemas'
import { makeRefreshAccessTokenController } from '@/main/factories/refresh-access-token'
import { adaptRoute } from '@/util/adapt-route'

export async function refreshAccessTokenRoute (app: FastifyInstance) {
  app.post('/refresh', {
    schema: {
      tags: ['Session'],
      description: 'Refresh access token',
      body: refreshAccessTokenBodySchema,
      response: refreshAccessTokenResponseSchema
    }
  }, adaptRoute(makeRefreshAccessTokenController()))
}
