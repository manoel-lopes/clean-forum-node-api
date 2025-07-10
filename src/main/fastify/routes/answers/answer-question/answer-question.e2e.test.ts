import { uuidv7 } from 'uuidv7'
import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { Slug } from '@/domain/value-objects/slug/slug.vo'

import { appFactory } from '@/main/fastify/app'

import { questionsRoutes } from '../../questions/questions.routes'
import { usersRoutes } from '../../users/users.routes'
import { answersRoutes } from '../answers.routes'

describe('Answer Question Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, questionsRoutes, answersRoutes] })
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .send({
        authorId: uuidv7(),
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 400 and an error response if the authorId field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .send({
        content: 'Some content',
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The authorId is required'
    })
  })

  it('should return 400 and an error response if the questionId field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .send({
        content: 'Some content',
        authorId: uuidv7(),
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required'
    })
  })

  it('should return 422 and an error response if the authorId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .send({
        content: 'Some content',
        authorId: 'invalid-uuid',
        questionId: uuidv7(),
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid authorId'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .send({
        content: 'Some content',
        authorId: uuidv7(),
        questionId: 'invalid-uuid',
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 201 on successful answer creation', async () => {
    const userEmail = `answer.author.${uuidv7()}@example.com`
    await request(app.server)
      .post('/users')
      .send({
        name: 'Answer Author',
        email: userEmail,
        password: 'password123',
      })

    const getUserByEmailResponse = await request(app.server)
      .get(`/users/${userEmail}`)

    const authorId = getUserByEmailResponse.body.id

    const questionTitle = `New Question ${uuidv7()}`
    await request(app.server)
      .post('/questions')
      .send({
        title: questionTitle,
        content: 'This is the content of the new question.',
        authorId,
      })

    const getQuestionBySlugResponse = await request(app.server)
      .get(`/questions/${Slug.create(questionTitle).value}`)

    const questionId = getQuestionBySlugResponse.body.id

    const httpResponse = await request(app.server)
      .post('/answers')
      .send({
        content: 'This is a new answer to the question.',
        authorId,
        questionId,
      })

    expect(httpResponse.statusCode).toBe(201)
  })
})
