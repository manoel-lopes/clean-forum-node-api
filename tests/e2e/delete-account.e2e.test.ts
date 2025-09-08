import type { FastifyInstance } from 'fastify'
import { createTestApp } from '../helpers/app-factory'
import { makeAuthToken } from '../helpers/make-auth-token'
import { deleteUser } from '../helpers/user-helpers'

describe('Delete Account', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 429 and rate limit on account deletion requests', async () => {
    const tokens = []

    for (let i = 0; i < 10; i++) {
      const token = await makeAuthToken(app)
      tokens.push(token)
      await deleteUser(app, token)
    }

    const finalToken = await makeAuthToken(app)

    const httpResponse = await deleteUser(app, finalToken)

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body).toEqual({
      error: 'Too Many Requests',
      code: 'USER_CREATION_RATE_LIMIT_EXCEEDED',
      message: 'Too many account creation attempts. Please try again later.',
      retryAfter: 60
    })
  })

  it('should return 204 on successful account deletion', async () => {
    const freshApp = await createTestApp()
    await freshApp.ready()

    const authToken = await makeAuthToken(freshApp)

    const httpResponse = await deleteUser(freshApp, authToken)

    expect(httpResponse.statusCode).toBe(204)

    await freshApp.close()
  })
})
