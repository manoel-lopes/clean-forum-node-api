import type { FastifyInstance } from 'fastify'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { authenticateUser, createUser, deleteUser } from '../helpers/user-helpers'

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
      const userData = aUser()
        .withEmail(`rate-limit-delete-${i}-${Date.now()}@example.com`)
        .build()
      await createUser(app, userData)
      const authResponse = await authenticateUser(app, {
        email: userData.email,
        password: userData.password,
      })
      tokens.push(authResponse.body.token)
      await deleteUser(app, authResponse.body.token)
    }

    const finalUserData = aUser()
      .withEmail(`rate-limit-delete-final-${Date.now()}@example.com`)
      .build()
    await createUser(app, finalUserData)
    const finalAuthResponse = await authenticateUser(app, {
      email: finalUserData.email,
      password: finalUserData.password,
    })

    const httpResponse = await deleteUser(app, finalAuthResponse.body.token)

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

    const userData = aUser().withName('John Doe').build()
    await createUser(freshApp, userData)
    const authResponse = await authenticateUser(freshApp, {
      email: userData.email,
      password: userData.password,
    })

    const httpResponse = await deleteUser(freshApp, authResponse.body.token)

    expect(httpResponse.statusCode).toBe(204)

    await freshApp.close()
  })
})
