import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

async function getAuthToken (app: FastifyInstance) {
  const userData = {
    name: 'Auth User for Questions',
    email: `auth.questions.${uuidv7()}@example.com`,
    password: 'P@ssword123',
  }
  await request(app.server).post('/users').send(userData)
  const response = await request(app.server).post('/auth')
    .send({
      email: userData.email,
      password: userData.password,
    })
  return response.body.token
}

describe('Get Question By Slug Route', async () => {
  const routes = [usersRoutes, questionsRoutes, sessionRoutes]
  const app = await appFactory({ routes })
  await app.ready()
  const authToken = await getAuthToken(app)

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and the question with answers', async () => {
    const title = `New Question ${uuidv7()}`
    const slug = Slug.create(title).value
    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title,
        content: 'This is the content of the new question.',
      })

    const response = await request(app.server)
      .get(`/questions/${slug}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(title)
    expect(response.body.content).toBe('This is the content of the new question.')
    expect(response.body.answers.items).toEqual([])
    expect(response.body.answers).toHaveProperty('page')
    expect(response.body.answers).toHaveProperty('pageSize')
    expect(response.body.answers).toHaveProperty('totalItems', 0)
    expect(response.body.answers).toHaveProperty('totalPages')
    expect(response.body.answers).toHaveProperty('order')
  })
})
