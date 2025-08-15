import { uuidv7 } from 'uuidv7'
import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes' // Import sessionRoutes
import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

describe('Create Question Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, questionsRoutes, sessionRoutes] })
  await app.ready()
  const userData = {
    name: 'Auth User for Questions',
    email: `auth.questions.${uuidv7()}@example.com`,
    password: 'secure-password',
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

  it('should return 400 and an error response if the title field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/questions')
      .send({ content: 'Some content' })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The title is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/questions')
      .send({ title: 'Some title' })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 409 and an error response if the question title is already registered', async () => {
    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Some title',
        content: 'Some content',
      })

    const httpResponse = await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Some title',
        content: 'Some content',
      })

    expect(httpResponse.statusCode).toBe(409)
  })

  it('should return 201 on successful question creation', async () => {
    const httpResponse = await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: `New Question ${uuidv7()}`,
        content: 'This is the content of the new question.',
      })

    expect(httpResponse.statusCode).toBe(201)
  })
})
