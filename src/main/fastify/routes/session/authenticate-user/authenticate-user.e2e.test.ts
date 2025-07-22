import { uuidv7 } from 'uuidv7'
import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { usersRoutes } from '../../users/users.routes'
import { sessionRoutes } from '../session.routes'

describe('Authenticate User Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, sessionRoutes] })
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the email field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        password: 'password123',
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
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 404 if user does not exist', async () => {
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        email: `nonexistent.${uuidv7()}@example.com`,
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found'
    })
  })

  it('should return 401 if password is incorrect', async () => {
    const email = `auth.test.${uuidv7()}@example.com`
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email,
        password: 'correct-password',
      })
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        email,
        password: 'incorrect-password',
      })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid password'
    })
  })

  it('should return 200 on successful authentication', async () => {
    const userData = {
      name: 'John Doe',
      email: `auth.success.${uuidv7()}@example.com`,
      password: 'secure-password',
    }
    await request(app.server)
      .post('/users')
      .send({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      })
    const httpResponse = await request(app.server)
      .post('/auth')
      .send({
        email: userData.email,
        password: userData.password,
      })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id')
    expect(httpResponse.body).toHaveProperty('name', userData.name)
    expect(httpResponse.body).toHaveProperty('email', userData.email)
    expect(httpResponse.body).toHaveProperty('createdAt')
  })
})
