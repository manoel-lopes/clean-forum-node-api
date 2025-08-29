import request from 'supertest'
import { createTestApp } from '../helpers/app-factory'
import { createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Create Account Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an bad request error response if the name field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        email: generateUniqueUserData().email,
        password: 'P@ssword123',
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
        password: 'P@ssword123',
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
        email: generateUniqueUserData().email,
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
        password: 'P@ssword123',
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
        email: generateUniqueUserData().email,
        password: 'P@ssword123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'name', received number"
    })
  })

  it('should return 422 and an error response if the password is not a string', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: generateUniqueUserData().email,
        password: 123,
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'password', received number"
    })
  })

  it('should return 422 and an error response if the password is too short', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: generateUniqueUserData().email,
        password: '123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'password' must contain at least 6 characters"
    })
  })

  it('should return 422 and an error response if the password is too long', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: generateUniqueUserData().email,
        password: '1234567890123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'password' must contain at most 12 characters"
    })
  })

  it('should return 422 and an error response if the password does not contain at least one uppercase and one lowercase letter, one number and one special character', async () => {
    const httpResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: generateUniqueUserData().email,
        password: 'Password123',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'The password must contain at least one uppercase and one lowercase letter, one number and one special character'
    })
  })

  it('should return 201 on successful account creation', async () => {
    const userData = generateUniqueUserData('John Doe')
    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
