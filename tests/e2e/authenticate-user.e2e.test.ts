import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { createTestApp } from '../helpers/app-factory'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Authenticate User Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the email field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        password: 'P@ssword123',
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required'
    })
  })

  it('should return 400 and an error response if the password field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        email: 'test@example.com',
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The password is required'
    })
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        email: 'invalid-email',
        password: 'P@ssword123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 404 and an error response if user does not exist', async () => {
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        email: `nonexistent.${uuidv7()}@example.com`,
        password: 'P@ssword123',
      })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found'
    })
  })

  it('should return 401 and an error response if password is incorrect', async () => {
    const userData = generateUniqueUserData('John Doe')
    await createUser(app, userData)

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: 'IncorrectPassword',
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid password'
    })
  })

  it('should return 200 on successful authentication', async () => {
    const userData = generateUniqueUserData('John Doe')
    await createUser(app, userData)

    const httpResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
    expect(httpResponse.body.refreshToken).toHaveProperty('id')
    expect(httpResponse.body.refreshToken).toHaveProperty('userId')
    expect(httpResponse.body.refreshToken).toHaveProperty('expiresAt')
    expect(httpResponse.body.refreshToken).toHaveProperty('createdAt')
    expect(httpResponse.body.refreshToken).toHaveProperty('expiresAt')
  })
})
