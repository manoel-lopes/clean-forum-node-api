import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

describe('Fetch Questions Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, questionsRoutes, sessionRoutes] })

  await app.ready()
  const userData = {
    name: 'Auth User for Questions',
    email: `auth.questions.${uuidv7()}@example.com`,
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

  it('should return 200 and an empty list when no questions exist', async () => {
    const httpResponse = await request(app.server)
      .get('/questions')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return 200 and paginated questions when questions exist', async () => {
    const title1 = `Question 1 ${uuidv7()}`
    const title2 = `Question 2 ${uuidv7()}`

    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: title1,
        content: 'Content for question 1'
      })

    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: title2,
        content: 'Content for question 2'
      })

    const httpResponse = await request(app.server)
      .get('/questions')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(2)
    expect(httpResponse.body.items[0]).toHaveProperty('id')
    expect(httpResponse.body.items[0]).toHaveProperty('title')
    expect(httpResponse.body.items[0]).toHaveProperty('content')
    expect(httpResponse.body.items[0]).toHaveProperty('slug')
    expect(httpResponse.body.items[0]).toHaveProperty('createdAt')
    expect(httpResponse.body.items[0]).toHaveProperty('updatedAt')
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await request(app.server)
      .get('/questions?page=1&perPage=1')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.page).toBe(1)
    expect(httpResponse.body.pageSize).toBe(1)
  })
})
