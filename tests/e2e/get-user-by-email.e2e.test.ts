import type { FastifyInstance } from 'fastify'
import { aUser, type UserTestData } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { authenticateUser, createUser, getUserByEmail } from '../helpers/user-helpers'

describe('Get User By Email', () => {
  let app: FastifyInstance
  let authToken: string
  let userData: UserTestData

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    userData = aUser().withName().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email!,
      password: userData.password!,
    })
    authToken = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const httpResponse = await getUserByEmail(app, authToken, {
      email: 'invalid-email',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 404 and an error response if the user does not exist', async () => {
    const nonExistentUser = aUser().build()
    const httpResponse = await getUserByEmail(app, authToken, {
      email: nonExistentUser.email,
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should return 200 and the user data when user exists', async () => {
    const httpResponse = await getUserByEmail(app, authToken, {
      email: userData.email,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id')
    expect(httpResponse.body).toHaveProperty('name', userData.name)
    expect(httpResponse.body).toHaveProperty('email', userData.email)
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).not.toHaveProperty('password')
  })

  it('should return 200 when requesting existing auth user by email', async () => {
    const httpResponse = await getUserByEmail(app, authToken, {
      email: userData.email,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id')
    expect(httpResponse.body).toHaveProperty('name', userData.name)
    expect(httpResponse.body).toHaveProperty('email', userData.email)
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).not.toHaveProperty('password')
  })
})
