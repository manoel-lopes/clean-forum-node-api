import { uuidv7 } from 'uuidv7'
import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

import { appFactory } from '@/main/fastify/app'

import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

describe('Create Question Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, questionsRoutes] })
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the title field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/questions')
      .send({
        content: 'Some content',
        authorId: uuidv7(),
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The title is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/questions')
      .send({
        title: 'Some title',
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
      .post('/questions')
      .send({
        title: 'Some title',
        content: 'Some content',
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The authorId is required'
    })
  })

  it('should return 422 and an error response if the authorId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/questions')
      .send({
        title: 'Some title',
        content: 'Some content',
        authorId: 'invalid-uuid',
      })

    // expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid authorId'
    })
  })

  it('should return 201 on successful question creation', async () => {
    const email = `question.author.${uuidv7()}@example.com`
    await request(app.server)
      .post('/users')
      .send({
        name: 'Question Author',
        email,
        password: 'password123',
      })

    const getUserByEmailResponse = await request(app.server)
      .get(`/users/${email}`)

    const authorId = getUserByEmailResponse.body.id
    const httpResponse = await request(app.server)
      .post('/questions')
      .send({
        title: `New Question ${uuidv7()}`,
        content: 'This is the content of the new question.',
        authorId,
      })

    expect(httpResponse.statusCode).toBe(201)
  })
})
