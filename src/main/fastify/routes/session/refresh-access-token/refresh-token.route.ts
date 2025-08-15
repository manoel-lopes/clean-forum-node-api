import type { FastifyInstance } from 'fastify'
import { refreshTokenBodySchema, refreshTokenResponseSchema } from '@/infra/validation/zod/schemas/presentation/sessions/refresh-tokens.schemas'
import { makeRefreshAccessTokenController } from '@/main/factories/refresh-access-token'
import { adaptRoute } from '@/util/adapt-route'

export async function refreshTokenRoute (app: FastifyInstance) {
  app.post('/refresh-token', {
    schema: {
      tags: ['Session'],
      description: 'Refresh access token',
      body: refreshTokenBodySchema,
      response: refreshTokenResponseSchema
    }
  }, adaptRoute(makeRefreshAccessTokenController()))
}
