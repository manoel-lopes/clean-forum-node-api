import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from '../helpers/app-factory'
import { generateUniqueUserData, sendEmailValidation, verifyEmailValidation } from '../helpers/user-helpers'

describe('Verify Email E2E', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 404 when no email validation exists for email', async () => {
    const userData = generateUniqueUserData()

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

  it('should return 422 response when code format is invalid', async () => {
    const userData = generateUniqueUserData()

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

  it('should return 422 response for invalid email format', async () => {
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

  it('should return 404 response for non-existent email', async () => {
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

  it('should return 422 response when code is non-numeric', async () => {
    const userData = generateUniqueUserData()

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
    const userData = generateUniqueUserData()
    for (let i = 0; i < 10; i++) {
      await sendEmailValidation(app, { email: userData.email })
    }

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
    const freshApp = await createTestApp()
    await freshApp.ready()

    const userData = generateUniqueUserData()

    const httpResponse = await sendEmailValidation(freshApp, { email: userData.email })

    expect(httpResponse.statusCode).toBe(204)

    await freshApp.close()
  })
})
