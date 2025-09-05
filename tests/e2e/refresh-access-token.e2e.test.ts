import { uuidv7 } from 'uuidv7'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import {
  authenticateUser,
  createUser,
  refreshAccessToken
} from '../helpers/user-helpers'

describe('Refresh Access Token Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the refreshTokenId field is missing', async () => {
    const httpResponse = await refreshAccessToken(app, {})

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The refreshTokenId is required'
    })
  })

  it('should return 422 and an error response if the refreshTokenId format is invalid', async () => {
    const httpResponse = await refreshAccessToken(app, {
      refreshTokenId: 'invalid-token-id'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid refreshTokenId'
    })
  })

  it('should return 404 and an error response if refresh token does not exist', async () => {
    const httpResponse = await refreshAccessToken(app, {
      refreshTokenId: uuidv7()
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Refresh token not found'
    })
  })

  it('should return 200 and new token on successful refresh', async () => {
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })

    const httpResponse = await refreshAccessToken(app, {
      refreshTokenId: authResponse.body.refreshToken.id
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
  })
})
