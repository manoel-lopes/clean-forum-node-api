import { app } from '@/main/server'
import { aUser } from '../builders/user.builder'
import { sendEmailValidation } from '../helpers/domain/enterprise/users/email-validation-requests'
import { mailHog } from '../helpers/infra/email/mailhog-helper'

describe('Send Email Validation', () => {
  beforeEach(async () => {
    await mailHog.deleteAllMessages()
  })

  afterAll(async () => {
    await mailHog.deleteAllMessages()
  })

  it('should return 400 when email is missing', async () => {
    const httpResponse = await sendEmailValidation(app, { email: undefined })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required',
    })
  })

  it('should return 422 for invalid email format', async () => {
    const httpResponse = await sendEmailValidation(app, {
      email: 'invalid-email-format',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address',
    })
  })

  it('should return 422 for empty email', async () => {
    const httpResponse = await sendEmailValidation(app, {
      email: '',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address',
    })
  })

  it('should return 422 for null email', async () => {
    const httpResponse = await sendEmailValidation(app, {
      email: null,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'email', received null",
    })
  })

  it('should return 422 and reject invalid email formats', async () => {
    const invalidEmail = 'johndoe @gmail.com'

    const httpResponse = await sendEmailValidation(app, { email: invalidEmail })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address',
    })
  })

  it('should return 204 when successfully sending email validation', async () => {
    const userData = aUser().build()

    const httpResponse = await sendEmailValidation(app, { email: userData.email })

    expect(httpResponse.statusCode).toBe(204)
  })
})
