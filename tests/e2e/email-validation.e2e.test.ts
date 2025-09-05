import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from '../helpers/app-factory'
import { createUser, generateUniqueUserData, sendEmailValidation, verifyEmailValidation } from '../helpers/user-helpers'

describe('Email Validation Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 404 when email validation not found', async () => {
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

  it('should return 422 for invalid email format', async () => {
    const httpResponse = await verifyEmailValidation(app, {
      email: 'invalid-email',
      code: '123456'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 422 for invalid code format', async () => {
    const userData = generateUniqueUserData()
    await createUser(app, userData)
    const tooShortCode = '12345'

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: tooShortCode
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'code' must contain at least 6 characters"
    })
  })

  it('should return 422 for non-numeric code', async () => {
    const userData = generateUniqueUserData()
    await createUser(app, userData)
    const alphanumericCode = '12345a'

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: alphanumericCode
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid code'
    })
  })

  it('should return 400 when email is missing', async () => {
    const httpResponse = await verifyEmailValidation(app, { code: '123456' })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required'
    })
  })

  it('should return 400 when code is missing', async () => {
    const userData = generateUniqueUserData()

    const httpResponse = await verifyEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The code is required'
    })
  })

  it('should return 404 when trying to verify non-existent email validation', async () => {
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

  it('should successfully send email validation', async () => {
    const userData = generateUniqueUserData()

    const httpResponse = await sendEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should apply rate limiting for email validation requests', async () => {
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
})
