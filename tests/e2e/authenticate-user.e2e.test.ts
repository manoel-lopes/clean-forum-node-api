import type { FastifyInstance } from 'fastify'
import { aUser, type UserTestData } from '../builders/user.builder'
import { authenticateUser } from '../helpers/auth/session-helpers'
import { createUser } from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'

async function authenticateMultipleTimes(app: FastifyInstance, userData: UserTestData, attempts: number) {
  await createUser(app, userData)
  for (let i = 0; i < attempts; i++) {
    await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
  }
}

describe('Authenticate User', () => {
  it('should return 400 and an error response if the email field is missing', async () => {
    const userData = aUser().withPassword().build()

    const httpResponse = await authenticateUser(app, {
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required',
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
      message: 'The password is required',
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
      message: 'Invalid email',
    })
  })

  it('should return 404 and an error response if user does not exist', async () => {
    const nonExistentEmail = aUser().build().email
    const password = aUser().withPassword().build().password

    const httpResponse = await authenticateUser(app, {
      email: nonExistentEmail,
      password,
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should return 401 and an error response if password is incorrect', async () => {
    const userData = aUser().withEmail(`auth-wrong-pass-${Date.now()}@example.com`).build()
    await createUser(app, userData)

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: 'WrongPass@123',
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid password',
    })
  })

  it('should return 200 on successful authentication', async () => {
    const userData = aUser().withEmail(`auth-success-${Date.now()}@example.com`).build()
    await createUser(app, userData)

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
    expect(httpResponse.body.refreshToken).toHaveProperty('id')
    expect(httpResponse.body.refreshToken).toHaveProperty('userId')
    expect(httpResponse.body.refreshToken).toHaveProperty('expiresAt')
    expect(httpResponse.body.refreshToken).toHaveProperty('createdAt')
  })

  it('should return 429 and rate limit on authentication requests', async () => {
    const userData = aUser().withEmail(`auth-ratelimit-${Date.now()}@example.com`).build()
    await authenticateMultipleTimes(app, userData, 10)

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body).toEqual({
      error: 'Too Many Requests',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts. Please try again later.',
      retryAfter: 60,
    })
  })
})
