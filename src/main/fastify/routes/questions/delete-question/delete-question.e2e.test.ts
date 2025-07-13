import { uuidv7 } from 'uuidv7'
import { beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { Slug } from '@/domain/value-objects/slug/slug.vo'
import { appFactory } from '@/main/fastify/app'
import { usersRoutes } from '../../users/users.routes'
import { questionsRoutes } from '../questions.routes'

describe('Delete Question Route', async () => {
  const app = await appFactory({ routes: [usersRoutes, questionsRoutes] })
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .delete('/questions/invalid-question-id')
      .send({
        authorId: uuidv7(),
      })
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })
  it('should return 422 and an error response if the authorId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .delete(`/questions/${uuidv7()}`)
      .send({
        authorId: 'invalid-author-id',
      })
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid authorId'
    })
  })
  it('should not delete a question if the user is not the author', async () => {
    const email = `question.author.${uuidv7()}@example.com`
    const password = 'password123'
    // Create user
    await request(app.server)
      .post('/users')
      .send({
        name: 'Question Author',
        email,
        password,
      })
    // Get user by email to retrieve ID
    const getUserByEmailResponse = await request(app.server)
      .get(`/users/${email}`)
    const authorId = getUserByEmailResponse.body.id
    // Create question
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
    const otherUserEmail = `other.user.${uuidv7()}@example.com`
    const otherUserPassword = 'password123'
    // Create other user
    await request(app.server)
      .post('/users')
      .send({
        name: 'Other User',
        email: otherUserEmail,
        password: otherUserPassword,
      })
    // Get other user by email to retrieve ID
    const otherUserGetUserByEmailResponse = await request(app.server)
      .get(`/users/${otherUserEmail}`)
    const otherUserId = otherUserGetUserByEmailResponse.body.id
    const httpResponse = await request(app.server)
      .delete(`/questions/${questionId}`)
      .send({ authorId: otherUserId })
    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question'
    })
  })
  it('should return 404 if the question does not exist', async () => {
    const email = `question.author.${uuidv7()}@example.com`
    const password = 'password123'
    // Create user
    await request(app.server)
      .post('/users')
      .send({
        name: 'Question Author',
        email,
        password,
      })
    // Get user by email to retrieve ID
    const getUserByEmailResponse = await request(app.server)
      .get(`/users/${email}`)
    const authorId = getUserByEmailResponse.body.id
    const httpResponse = await request(app.server)
      .delete(`/questions/${uuidv7()}`)
      .send({ authorId })
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found'
    })
  })
  it('should return 204 on successful question deletion', async () => {
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
      .delete(`/questions/${questionId}`)
      .send({ authorId, })
    expect(httpResponse.statusCode).toBe(204)
  })
})
