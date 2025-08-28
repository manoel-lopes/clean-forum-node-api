import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import { appFactory } from '@/main/fastify/app'
import { questionsRoutes } from '../../questions/questions.routes'
import { sessionRoutes } from '../../session/session.routes'
import { usersRoutes } from '../../users/users.routes'
import { answersRoutes } from '../answers.routes'

describe('Answer Question Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, questionsRoutes, sessionRoutes, answersRoutes] })

  await app.ready()
  const userData = {
    name: 'Auth User for Answers',
    email: `auth.answers.${uuidv7()}@example.com`,
    password: 'P@ssword123',
  }

  await request(app.server).post('/users').send(userData)
  const authResponse = await request(app.server).post('/auth')
    .send({
      email: userData.email,
      password: userData.password,
    })

  const authToken = authResponse.body.token

  let questionId: string

  beforeAll(async () => {
    const questionTitle = `Test Question ${uuidv7()}`
    await request(app.server)
      .post('/questions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: questionTitle,
        content: 'Test question content'
      })

    const questionResponse = await request(app.server)
      .get(`/questions/${Slug.create(questionTitle).value}`)
      .set('Authorization', `Bearer ${authToken}`)

    questionId = questionResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId: 'invalid-question-id',
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId,
        content: 123
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Invalid type for 'content'"
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId: uuidv7(),
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful answer creation', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId,
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(201)
  })
})
