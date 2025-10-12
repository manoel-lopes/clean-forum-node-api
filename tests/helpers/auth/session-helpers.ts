import type { FastifyInstance } from 'fastify'
import request from 'supertest'

type AuthCredentials = {
  email?: unknown
  password?: unknown
}

type RefreshTokenData = {
  refreshTokenId?: string
}

export async function authenticateUser (
  app: FastifyInstance,
  credentials: AuthCredentials
) {
  const response = await request(app.server)
    .post('/auth')
    .send(credentials)
  return response
}

export async function refreshAccessToken (app: FastifyInstance, tokenData: RefreshTokenData) {
  return await request(app.server)
    .post('/auth/refresh-token')
    .send(tokenData)
}
