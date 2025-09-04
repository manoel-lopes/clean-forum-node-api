import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestApp } from '../helpers/app-factory'
import { createUser, generateUniqueUserData, verifyEmailValidation } from '../helpers/user-helpers'

describe('Email Validation Flow', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST /users/verify-email-validation', () => {
    it('should return 404 when email validation not found', async () => {
      const response = await verifyEmailValidation(app, {
        email: 'nonexistent@example.com',
        code: '123456'
      })

      expect(response.statusCode).toBe(404)
      expect(response.body).toEqual({
        error: 'Not Found',
        message: expect.any(String)
      })
    })

    it('should return 422 for invalid email format', async () => {
      const response = await verifyEmailValidation(app, {
        email: 'invalid-email',
        code: '123456'
      })

      expect(response.statusCode).toBe(422)
      expect(response.body).toEqual({
        error: 'Unprocessable Entity',
        message: expect.any(String)
      })
    })

    it('should return 422 for invalid code format', async () => {
      const userData = generateUniqueUserData()
      await createUser(app, userData)

      const response = await verifyEmailValidation(app, {
        email: userData.email,
        code: '12345' // too short
      })

      expect(response.statusCode).toBe(422)
      expect(response.body).toEqual({
        error: 'Unprocessable Entity',
        message: expect.any(String)
      })
    })

    it('should return 422 for non-numeric code', async () => {
      const userData = generateUniqueUserData()
      await createUser(app, userData)

      const response = await verifyEmailValidation(app, {
        email: userData.email,
        code: '12345a'
      })

      expect(response.statusCode).toBe(422)
      expect(response.body).toEqual({
        error: 'Unprocessable Entity',
        message: expect.any(String)
      })
    })

    it('should return 400 when required fields are missing', async () => {
      const responseNoEmail = await verifyEmailValidation(app, { code: '123456' })
      expect(responseNoEmail.statusCode).toBe(400)

      const userData = generateUniqueUserData()
      await createUser(app, userData)

      const responseNoCode = await verifyEmailValidation(app, { email: userData.email })
      expect(responseNoCode.statusCode).toBe(400)
    })

    it('should return 404 when trying to verify non-existent email validation', async () => {
      const userData = generateUniqueUserData()

      const verifyResponse = await verifyEmailValidation(app, {
        email: userData.email,
        code: '123456'
      })

      expect(verifyResponse.statusCode).toBe(404)
      expect(verifyResponse.body).toEqual({
        error: 'Not Found',
        message: expect.any(String)
      })
    })

    it('should return 404 for verification attempts without prior email validation creation', async () => {
      const userData = generateUniqueUserData()

      // Try to verify without first creating an email validation
      const verifyResponse = await verifyEmailValidation(app, {
        email: userData.email,
        code: '123456'
      })

      expect(verifyResponse.statusCode).toBe(404)
      expect(verifyResponse.body).toEqual({
        error: 'Not Found',
        message: expect.any(String)
      })
    })
  })
})
