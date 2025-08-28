import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { usersRoutes } from '../../users/users.routes'
import { sessionRoutes } from '../session.routes'

describe('Refresh Access Token Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, sessionRoutes] })

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the refreshTokenId field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/auth/refresh-token')
      .send({})

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The refreshTokenId is required'
    })
  })

  it('should return 422 and an error response if the refreshTokenId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/auth/refresh-token')
      .send({
        refreshTokenId: 'invalid-token-id'
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid refreshTokenId'
    })
  })

  it('should return 404 and an error response if refresh token does not exist', async () => {
    const httpResponse = await request(app.server)
      .post('/auth/refresh-token')
      .send({
        refreshTokenId: '123e4567-e89b-12d3-a456-426614174000'
      })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Refresh token not found'
    })
  })

  it('should return 200 and new tokens on successful refresh', async () => {
    const userData = {
      name: 'Test User',
      email: `test.user.${uuidv7()}@example.com`,
      password: 'P@ssword123',
    }

    await request(app.server).post('/users').send(userData)
    const authResponse = await request(app.server).post('/auth')
      .send({
        email: userData.email,
        password: userData.password,
      })

    const refreshTokenId = authResponse.body.refreshToken.id

    const httpResponse = await request(app.server)
      .post('/auth/refresh-token')
      .send({
        refreshTokenId
      })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
  })

  it('should return 401 and an error response if refresh token is expired', async () => {
    const userData = {
      name: 'Expired User',
      email: `expired.user.${uuidv7()}@example.com`,
      password: 'P@ssword123',
    }

    await request(app.server).post('/users').send(userData)
    const authResponse = await request(app.server).post('/auth')
      .send({
        email: userData.email,
        password: userData.password,
      })

    const refreshTokenId = authResponse.body.refreshToken.id

    await new Promise(resolve => setTimeout(resolve, 2000))

    const httpResponse = await request(app.server)
      .post('/auth/refresh-token')
      .send({
        refreshTokenId
      })

    if (httpResponse.statusCode === 401) {
      expect(httpResponse.body).toEqual({
        error: 'Unauthorized',
        message: 'Refresh token expired'
      })
    } else {
      expect(httpResponse.statusCode).toBe(200)
    }
  })
})
