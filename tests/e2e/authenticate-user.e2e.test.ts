import type { FastifyInstance } from 'fastify'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Authenticate User Route', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the email field is missing', async () => {
    const userData = aUser().withPassword().build()
    const httpResponse = await authenticateUser(app, {
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required'
    })
  })

  it('should return 400 and an error response if the password field is missing', async () => {
    const userData = aUser().withEmail().build()
    const httpResponse = await authenticateUser(app, {
      email: userData.email,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The password is required'
    })
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const userData = aUser().withPassword().build()
    const httpResponse = await authenticateUser(app, {
      email: 'invalid-email',
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 404 and an error response if user does not exist', async () => {
    const nonExistentUser = aUser().build()
    const userData = aUser().withPassword().build()
    const httpResponse = await authenticateUser(app, {
      email: nonExistentUser.email,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found'
    })
  })

  it('should return 401 and an error response if password is incorrect', async () => {
    const userData = aUser()
      .withEmail(`auth-wrong-pass-${Date.now()}@example.com`)
      .build()
    await createUser(app, userData)

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: 'IncorrectPassword',
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid password'
    })
  })

  it('should return 200 on successful authentication', async () => {
    // Create a fresh app instance for this test to avoid rate limiting interference
    const freshApp = await createTestApp()
    await freshApp.ready()

    const userData = aUser()
      .withEmail(`auth-success-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`)
      .build()
    await createUser(freshApp, userData)

    const httpResponse = await authenticateUser(freshApp, {
      email: userData.email,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
    expect(httpResponse.body.refreshToken).toHaveProperty('id')
    expect(httpResponse.body.refreshToken).toHaveProperty('userId')
    expect(httpResponse.body.refreshToken).toHaveProperty('expiresAt')
    expect(httpResponse.body.refreshToken).toHaveProperty('createdAt')
    expect(httpResponse.body.refreshToken).toHaveProperty('expiresAt')

    await freshApp.close()
  })

  it('should return 429 and rate limit on authentication requests', async () => {
    const userData = aUser()
      .withEmail(`rate-limit-auth-${Date.now()}@example.com`)
      .build()
    await createUser(app, userData)
    for (let i = 0; i < 5; i++) {
      await authenticateUser(app, {
        email: userData.email,
        password: userData.password
      })
    }

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body).toEqual({
      error: 'Too Many Requests',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: 60
    })
  })
})
