import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { app } from '@/main/fastify/app'

describe('Create Account Route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should return 400 and an error response if the name field is missing', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('The name is required')
  })

  it('should return 400 and an error response if the email is missing', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Test User',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('The email is required')
  })

  it('should return 400 and an error response if the password is missing', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body.message).toEqual('The password is required')
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(422)
    expect(response.body.message).toEqual('Invalid email')
  })

  it('should return 422 and an error response if the name is not a string', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 123,
        email: 'test@example.com',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(422)
    expect(response.body.message).toEqual('The name expected string, received number')
  })

  it('should return 422 and an error response if the password is not a string', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 123,
      })

    expect(response.statusCode).toEqual(422)
    expect(response.body.message).toEqual('The password expected string, received number')
  })

  it('should return 201 code on the correct creation of an account', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      })

    expect(response.statusCode).toEqual(201)
  })
})
