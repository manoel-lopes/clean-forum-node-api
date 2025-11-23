import type { FastifyInstance } from 'fastify'
import { app } from '@/main/server'
import { aUser } from '../builders/user.builder'
import { createUser } from '../helpers/domain/enterprise/users/user-requests'

async function makeUsers (app: FastifyInstance, amount: number) {
  for (let i = 0; i < amount; i++) {
    const userData = aUser().withEmail(`rate-limit-${i}-${Date.now()}@example.com`).build()
    await createUser(app, userData)
  }
}

describe('Create Account', () => {
  it('should return 400 and a bad request error response if the name field is missing', async () => {
    const userData = aUser().withEmail().withPassword().build()

    const httpResponse = await createUser(app, {
      password: userData.password,
      email: userData.email,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The name is required',
    })
  })

  it('should return 400 and an error response if the email is missing', async () => {
    const userData = aUser().withName().withPassword().build()

    const httpResponse = await createUser(app, {
      name: userData.name,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required',
    })
  })

  it('should return 400 and an error response if the password is missing', async () => {
    const userData = aUser().withName().withEmail().build()

    const httpResponse = await createUser(app, {
      name: userData.name,
      email: userData.email,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The password is required',
    })
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const userData = aUser().withName().withEmail('invalid-email').withPassword().build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email',
    })
  })

  it('should return 422 and an error response if the name is not a string', async () => {
    const userData = aUser().withName(123).withEmail().withPassword().build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'name', received number",
    })
  })

  it('should return 422 and an error response if the password is not a string', async () => {
    const userData = aUser().withName().withEmail().withPassword(123).build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'password', received number",
    })
  })

  it('should return 422 and an error response if the password is too short', async () => {
    const userData = aUser().withName().withEmail().withPassword('123').build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'password' must contain at least 6 characters",
    })
  })

  it('should return 422 and an error response if the password is too long', async () => {
    const userData = aUser().withName().withEmail().withPassword('1234567890123').build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'password' must contain at most 12 characters",
    })
  })

  it('should return 422 and an error response if the password does not contain at least one uppercase and one lowercase letter, one number and one special character', async () => {
    const userData = aUser().withName().withEmail().withPassword('Password123').build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message:
        'The password must contain at least one uppercase and one lowercase letter, one number and one special character',
    })
  })

  it('should return 201 on successful account creation', async () => {
    const userData = aUser().withEmail(`create-success-${Date.now()}@example.com`).build()
    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(201)
  })

  it('should return 429 and rate limit on account creation requests', async () => {
    await makeUsers(app, 20)
    const userData = aUser().withEmail().build()

    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(429)
    expect(httpResponse.body).toEqual({
      error: 'Too Many Requests',
      code: 'USER_CREATION_RATE_LIMIT_EXCEEDED',
      message: 'Too many account creation attempts. Please try again later.',
      retryAfter: 60,
    })
  })
})
