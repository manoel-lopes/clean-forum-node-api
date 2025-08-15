import { uuidv7 } from 'uuidv7'
import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { usersRoutes } from '../users.routes'

describe('Create Account Route', async () => {
  const app = await appFactory({ routes: [usersRoutes] })

  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an bad request error response if the name field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        email: `john.doe.${uuidv7()}@example.com`,
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The name is required'
    })
  })

  it('should return 400 and an error response if the email is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required'
    })
  })

  it('should return 400 and an error response if the password is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe.${uuidv7()}@example.com`,
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The password is required'
    })
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 422 and an error response if the name is not a string', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 123,
        email: `john.doe.${uuidv7()}@example.com`,
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Invalid type for 'name'"
    })
  })

  it('should return 422 and an error response if the password is not a string', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe.${uuidv7()}@example.com`,
        password: 123,
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Invalid type for 'password'"
    })
  })

  it('should return 201 on successful account creation', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `john.doe.${uuidv7()}@example.com`,
        password: 'password123',
      })

    expect(httpResponse.statusCode).toBe(201)
  })
})
