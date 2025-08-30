import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export type RefreshAccessTokenData = {
  refreshTokenId?: string
}

export async function refreshAccessToken (app: FastifyInstance, { refreshTokenId }: RefreshAccessTokenData) {
  return await request(app.server)
    .post('/auth/refresh-token')
    .send({ refreshTokenId })
}
