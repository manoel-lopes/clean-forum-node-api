import { sendEmailValidation } from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'
import { mailHog } from '../helpers/mailhog.helper'

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

  it('should reject invalid email formats', async () => {
    const invalidEmail = 'johndoe @gmail.com'

    const httpResponse = await sendEmailValidation(app, { email: invalidEmail })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email address',
    })
  })
})
