import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../users.routes'

describe('Get User By Email Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, sessionRoutes] })

  await app.ready()
  const userData = {
    name: 'Auth User for Users',
    email: `auth.users.${uuidv7()}@example.com`,
    password: 'P@ssword123',
  }

  await request(app.server).post('/users').send(userData)
  const authResponse = await request(app.server).post('/auth')
    .send({
      email: userData.email,
      password: userData.password,
    })

  const authToken = authResponse.body.token

  afterAll(async () => {
    await app.close()
  })

  it('should return 422 and an error response if the email format is invalid', async () => {
    const httpResponse = await request(app.server)
      .get('/users/invalid-email')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid email'
    })
  })

  it('should return 404 and an error response if the user does not exist', async () => {
    const httpResponse = await request(app.server)
      .get(`/users/nonexistent.${uuidv7()}@example.com`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should return 200 and the user data when user exists', async () => {
    const testUserData = {
      name: 'Test User',
      email: `test.user.${uuidv7()}@example.com`,
      password: 'P@ssword123',
    }

    await request(app.server).post('/users').send(testUserData)

    const httpResponse = await request(app.server)
      .get(`/users/${testUserData.email}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id')
    expect(httpResponse.body).toHaveProperty('name', testUserData.name)
    expect(httpResponse.body).toHaveProperty('email', testUserData.email)
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).not.toHaveProperty('password')
  })

  it('should return 200 when requesting existing auth user by email', async () => {
    const httpResponse = await request(app.server)
      .get(`/users/${userData.email}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id')
    expect(httpResponse.body).toHaveProperty('name', userData.name)
    expect(httpResponse.body).toHaveProperty('email', userData.email)
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).not.toHaveProperty('password')
  })
})
