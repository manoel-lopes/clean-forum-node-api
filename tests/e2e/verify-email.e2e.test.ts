import { aUser } from 'tests/builders/user.builder'
import {
  getLastEmailCodeForEmail,
  sendEmailValidation,
  verifyEmailValidation
} from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'

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

  it('should return 400 when trying to verify email that is already isVerified', async () => {
    const userData = aUser().withEmail('test-already-isVerified@example.com').build()

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
      message: 'This email has already been isVerified'
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
})
