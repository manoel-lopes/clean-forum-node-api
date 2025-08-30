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
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      email: userData.email,
      password: 'P@ssword123',
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The name is required'
    })
  })

  it('should return 400 and an error response if the email is missing', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The email is required'
    })
  })

  it('should return 400 and an error response if the password is missing', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      email: userData.email,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The password is required'
    })
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      email: 'invalid-email',
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 422 and an error response if the name is not a string', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: 123,
      email: userData.email,
      password: userData.password,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'name', received number"
    })
  })

  it('should return 422 and an error response if the password is not a string', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      email: userData.email,
      password: 123,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'password', received number"
    })
  })

  it('should return 422 and an error response if the password is too short', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      email: userData.email,
      password: '123',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'password' must contain at least 6 characters"
    })
  })

  it('should return 422 and an error response if the password is too long', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      email: userData.email,
      password: '1234567890123',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "The 'password' must contain at most 12 characters"
    })
  })

  it('should return 422 and an error response if the password does not contain at least one uppercase and one lowercase letter, one number and one special character', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, {
      name: userData.name,
      email: userData.email,
      password: 'Password123',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'The password must contain at least one uppercase and one lowercase letter, one number and one special character'
    })
  })

  it('should return 201 on successful account creation', async () => {
    const userData = generateUniqueUserData()
    const httpResponse = await createUser(app, userData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
