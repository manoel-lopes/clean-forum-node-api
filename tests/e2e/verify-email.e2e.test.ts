import { aUser } from 'tests/builders/user.builder'
import type { FastifyInstance } from 'fastify'
import {
  getLastEmailCodeForEmail,
  sendEmailValidation,
  verifyEmailValidation
} from '../helpers/entities/user-helpers'
import { app } from '../helpers/infrastructure/test-app'

async function makeMultipleEmailValidationRequests (
  app: FastifyInstance,
  email: unknown,
  amount: number
) {
  for (let i = 0; i < amount; i++) {
    await sendEmailValidation(app, { email })
  }
}

describe('Verify Email', () => {
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

  it('should return 422 when code format is invalid', async () => {
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

  it('should return 422 for invalid email format', async () => {
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

  it('should return 404 for non-existent email', async () => {
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

  it('should return 422 when code is non-numeric', async () => {
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

  it('should verify email validation with correct code', async () => {
    const userData = aUser().withEmail('test-verification@example.com').build()

    await sendEmailValidation(app, { email: userData.email })
    const sentCode = await getLastEmailCodeForEmail(userData.email)

    expect(sentCode).toBeDefined()
    expect(sentCode).toMatch(/^\d{6}$/)

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: sentCode!
    })

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should return 400 when using wrong verification code', async () => {
    const userData = aUser().withEmail('test-wrong-code@example.com').build()

    await sendEmailValidation(app, { email: userData.email })
    const wrongCode = '999999'

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: wrongCode
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'Invalid validation code'
    })
  })

  it('should return 204 when using valid sent code immediately', async () => {
    const userData = aUser().withEmail('test-immediate-code@example.com').build()

    await sendEmailValidation(app, { email: userData.email })
    const sentCode = await getLastEmailCodeForEmail(userData.email)

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: sentCode!
    })

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should return 400 when trying to verify email that is already verified', async () => {
    const userData = aUser().withEmail('test-already-verified@example.com').build()

    await sendEmailValidation(app, { email: userData.email })
    const sentCode = await getLastEmailCodeForEmail(userData.email)

    const firstResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: sentCode!
    })

    expect(firstResponse.statusCode).toBe(204)

    const secondResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: sentCode!
    })

    expect(secondResponse.statusCode).toBe(400)
    expect(secondResponse.body).toEqual({
      error: 'Bad Request',
      message: 'This email has already been verified'
    })
  })

  it('should return 204 on successful email validation', async () => {
    const userData = aUser().withEmail('test-success-final-validation@example.com').build()

    await sendEmailValidation(app, { email: userData.email })
    const sentCode = await getLastEmailCodeForEmail(userData.email)

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: sentCode!
    })

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should return 429 and rate limit on email validation requests', async () => {
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
})
