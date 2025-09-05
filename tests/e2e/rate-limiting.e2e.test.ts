import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import {
  authenticateUser,
  createUser,
  deleteUser,
  generateUniqueUserData,
  sendEmailValidation,
  verifyEmailValidation
} from '../helpers/user-helpers'

describe('Rate Limiting', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('Authentication Rate Limiting', () => {
    it('should apply rate limiting for authentication requests', async () => {
      const userData = aUser().build()
      await createUser(app, userData)

      // Make exactly the max number of requests (5), then one more to trigger rate limiting
      for (let i = 0; i < 5; i++) {
        await authenticateUser(app, {
          email: userData.email,
          password: userData.password,
        })
      }

      const httpResponse = await authenticateUser(app, {
        email: userData.email,
        password: userData.password,
      })

      expect(httpResponse.statusCode).toBe(429)
      expect(httpResponse.body).toEqual({
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many authentication attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })
  })

  describe('User Creation Rate Limiting', () => {
    it('should apply rate limiting for user creation requests', async () => {
      const users = Array.from({ length: 11 }, () => aUser().build())

      // Make exactly the max number of requests (10), then one more to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        await createUser(app, users[i])
      }

      const httpResponse = await createUser(app, users[10])

      expect(httpResponse.statusCode).toBe(429)
      expect(httpResponse.body).toEqual({
        code: 'USER_CREATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many account creation attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })
  })

  describe('User Deletion Rate Limiting', () => {
    it('should apply rate limiting for user deletion requests', async () => {
      const users = Array.from({ length: 11 }, () => aUser().build())
      const tokens: string[] = []

      // Create users and get their auth tokens
      for (let i = 0; i < 11; i++) {
        await createUser(app, users[i])
        const authResponse = await authenticateUser(app, {
          email: users[i].email,
          password: users[i].password,
        })
        tokens.push(authResponse.body.token)
      }

      // Make exactly the max number of requests (10), then one more to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        await deleteUser(app, tokens[i])
      }

      const httpResponse = await deleteUser(app, tokens[10])

      expect(httpResponse.statusCode).toBe(429)
      expect(httpResponse.body).toEqual({
        code: 'USER_CREATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many account creation attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })
  })

  describe('Email Validation Rate Limiting', () => {
    it('should apply rate limiting for email validation send requests', async () => {
      const userData = generateUniqueUserData()

      // Make exactly the max number of requests (10), then one more to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        await sendEmailValidation(app, { email: userData.email })
      }

      const httpResponse = await sendEmailValidation(app, { email: userData.email })

      expect(httpResponse.statusCode).toBe(429)
      expect(httpResponse.body).toEqual({
        code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many email validation attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })

    it('should apply rate limiting for email verification requests', async () => {
      const userData = generateUniqueUserData()

      // Make exactly the max number of requests (10), then one more to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        await verifyEmailValidation(app, {
          email: userData.email,
          code: '123456'
        })
      }

      const httpResponse = await verifyEmailValidation(app, {
        email: userData.email,
        code: '123456'
      })

      expect(httpResponse.statusCode).toBe(429)
      expect(httpResponse.body).toEqual({
        code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many email validation attempts. Please try again later.',
        retryAfter: expect.any(Number)
      })
    })
  })
})
