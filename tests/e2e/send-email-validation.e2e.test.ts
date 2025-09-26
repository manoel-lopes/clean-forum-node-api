import { aUser } from 'tests/builders/user.builder'
import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from '../helpers/app-factory'
import { sendEmailValidation } from '../helpers/user-helpers'

async function makeMultipleEmailValidationRequests (app: FastifyInstance, email: unknown, amount: number) {
  for (let i = 0; i < amount; i++) {
    await sendEmailValidation(app, { email })
  }
}

describe('Send Email Validation', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 when email is missing', async () => {
    const httpResponse = await sendEmailValidation(app, { email: undefined })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required'
    })
  })

  it('should return 422 for invalid email format', async () => {
    const httpResponse = await sendEmailValidation(app, {
      email: 'invalid-email-format'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address'
    })
  })

  it('should return 422 for empty email', async () => {
    const httpResponse = await sendEmailValidation(app, {
      email: ''
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address'
    })
  })

  it('should return 422 for null email', async () => {
    const httpResponse = await sendEmailValidation(app, {
      email: null
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'email', received null"
    })
  })

  it('should return 429 and rate limit on excessive email validation requests', async () => {
    const userData = aUser().withEmail().build()

    await makeMultipleEmailValidationRequests(app, userData.email, 20)

    const httpResponse = await sendEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body).toEqual({
      error: 'Too Many Requests',
      code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
      message: 'Too many email validation attempts. Please try again later.',
      retryAfter: 60
    })
  })

  it('should reject invalid email formats', async () => {
    const freshApp = await createTestApp()
    await freshApp.ready()

    const invalidEmail = 'johndoe @gmail.com'

    const httpResponse = await sendEmailValidation(freshApp, { email: invalidEmail })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address'
    })

    await freshApp.close()
  })

  it('should successfully send email validation code', async () => {
    const freshApp = await createTestApp()
    await freshApp.ready()

    const userData = aUser().build()

    const httpResponse = await sendEmailValidation(freshApp, {
      email: userData.email
    })

    expect(httpResponse.statusCode).toBe(204)
    await freshApp.close()
  })
})
