import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

describe('Get Question By Slug Route', async () => {
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

    const questionResponse = await request(app.server)
      .get(`/questions/${slug}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(questionResponse.statusCode).toBe(200)
    expect(questionResponse.body.title).toBe(title)
    expect(questionResponse.body.answers).toEqual([])
  })
})
