import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../users.routes'

describe('Fetch Users Route', async () => {
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

  it('should return 200 and paginated users list', async () => {
    const user1Data = {
      name: 'User One',
      email: `user1.${uuidv7()}@example.com`,
      password: 'P@ssword123',
    }

    const user2Data = {
      name: 'User Two',
      email: `user2.${uuidv7()}@example.com`,
      password: 'P@ssword123',
    }

    await request(app.server).post('/users').send(user1Data)
    await request(app.server).post('/users').send(user2Data)

    const httpResponse = await request(app.server)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(3)
    expect(httpResponse.body.items[0]).toHaveProperty('id')
    expect(httpResponse.body.items[0]).toHaveProperty('name')
    expect(httpResponse.body.items[0]).toHaveProperty('email')
    expect(httpResponse.body.items[0]).toHaveProperty('createdAt')
    expect(httpResponse.body.items[0]).toHaveProperty('updatedAt')
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await request(app.server)
      .get('/users?page=1&perPage=2')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.page).toBe(1)
    expect(httpResponse.body.pageSize).toBe(2)
    expect(httpResponse.body.items).toHaveLength(2)
  })

  it('should return 200 with order parameter', async () => {
    const httpResponse = await request(app.server)
      .get('/users?order=asc')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order')
    expect(httpResponse.body.order).toBe('asc')
  })
})
