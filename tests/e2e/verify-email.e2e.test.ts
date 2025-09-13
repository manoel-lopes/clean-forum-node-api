import { aUser } from 'tests/builders/user.builder'
import type { FastifyInstance } from 'fastify'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from '../helpers/app-factory'
import { sendEmailValidation, verifyEmailValidation } from '../helpers/user-helpers'

async function makeMultipleEmailValidationRequests (app: FastifyInstance, email: unknown, amount: number) {
  for (let i = 0; i < amount; i++) {
    await sendEmailValidation(app, { email })
  }
}

describe('Verify Email', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 404 when no email validation exists for email', async () => {
    const userData = aUser().build()

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: '123456'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'No email validation found for this email'
    })
  })

  it('should return 422 httpResponse when code format is invalid', async () => {
    const userData = aUser().build()

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: '12345'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'code' must contain at least 6 characters"
    })
  })

  it('should return 422 httpResponse for invalid email format', async () => {
    const httpResponse = await verifyEmailValidation(app, {
      email: 'invalid-email-format',
      code: '123456'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 404 httpResponse for non-existent email', async () => {
    const httpResponse = await verifyEmailValidation(app, {
      email: 'nonexistent@example.com',
      code: '123456'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'No email validation found for this email'
    })
  })

  it('should return 422 httpResponse when code is non-numeric', async () => {
    const userData = aUser().build()

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: '12345a'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid code'
    })
  })

  it('should return 429 and rate limit on email validation requests', async () => {
    const userData = aUser().withEmail().build()
    await makeMultipleEmailValidationRequests(app, userData.email, 10)

    const httpResponse = await sendEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body).toEqual({
      error: 'Too Many Requests',
      code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
      message: 'Too many email validation attempts. Please try again later.',
      retryAfter: 60
    })
  })

  it('should send email validation successfully', async () => {
    const userData = aUser().withEmail().build()

    const httpResponse = await sendEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(204)
  })
})
