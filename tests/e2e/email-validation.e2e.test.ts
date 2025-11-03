import { app } from '@/main/server'
import { aUser } from '../builders/user.builder'
import { createUser, sendEmailValidation, verifyEmailValidation } from '../helpers/domain/user-helpers'

describe('Email Validation', () => {
  beforeAll(async () => {})

  it('should return 404 when email validation not found', async () => {
    const httpResponse = await verifyEmailValidation(app, {
      email: 'nonexistent@example.com',
      code: '123456',
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'No email validation found for this email',
    })
  })

  it('should return 422 for invalid email format', async () => {
    const httpResponse = await verifyEmailValidation(app, {
      email: 'invalid-email',
      code: '123456',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email',
    })
  })

  it('should return 422 for invalid code format', async () => {
    const userData = aUser().build()
    await createUser(app, userData)
    const tooShortCode = '12345'

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: tooShortCode,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'code' must contain at least 6 characters",
    })
  })

  it('should return 422 for non-numeric code', async () => {
    const userData = aUser().build()
    await createUser(app, userData)
    const alphanumericCode = '12345a'

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: alphanumericCode,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid code',
    })
  })

  it('should return 400 when email is missing', async () => {
    const httpResponse = await verifyEmailValidation(app, { code: '123456' })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required',
    })
  })

  it('should return 400 when code is missing', async () => {
    const userData = aUser().build()

    const httpResponse = await verifyEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The code is required',
    })
  })

  it('should return 404 when trying to verify non-existent email validation', async () => {
    const userData = aUser().build()

    const httpResponse = await verifyEmailValidation(app, {
      email: userData.email,
      code: '123456',
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'No email validation found for this email',
    })
  })

  it('should successfully send email validation', async () => {
    const userData = aUser().build()

    const httpResponse = await sendEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(204)
  })
})
