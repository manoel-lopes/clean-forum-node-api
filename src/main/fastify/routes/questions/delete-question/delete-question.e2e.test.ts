import { uuidv7 } from 'uuidv7'
import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import { appFactory } from '@/main/fastify/app'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

describe('Delete Question Route', async () => {
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

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .delete('/questions/invalid-question-id')

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const httpResponse = await request(app.server)
      .delete('/questions/123e4567-e89b-12d3-a456-426614174000')

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 403 and an error response if the user is not the author', async () => {
    const title = `New Question ${uuidv7()}`
    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title,
        content: 'This is a test question content'
      })

    const notAuthorData = {
      name: 'Not Author User for Questions',
      email: `not.author.questions.${uuidv7()}@example.com`,
      password: 'secure-password',
    }

    await request(app.server).post('/users').send(notAuthorData)
    const notAuthorAuthResponse = await request(app.server).post('/auth')
      .send({
        email: notAuthorData.email,
        password: notAuthorData.password,
      })

    const getQuestionBySlugResponse = await request(app.server)
      .get(`/questions/${Slug.create(title).value}`)

    const httpResponse = await request(app.server)
      .delete(`/questions/${getQuestionBySlugResponse.body.id}`)
      .set('Authorization', `Bearer ${notAuthorAuthResponse.body.token}`)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question',
    })
  })

  it('should return 204 on successful question deletion', async () => {
    const title = `New Question ${uuidv7()}`
    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title,
        content: 'This is a test question content'
      })

    const getQuestionBySlugResponse = await request(app.server)
      .get(`/questions/${Slug.create(title).value}`)

    const httpResponse = await request(app.server)
      .delete(`/questions/${getQuestionBySlugResponse.body.id}`)
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(204)
  })
})
