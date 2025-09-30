import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { commentOnAnswer, createAnswer } from '../helpers/domain/answer-helpers'
import { fetchAnswerComments } from '../helpers/domain/comment-helpers'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function makeCommentsForAnswer (app: FastifyInstance, authToken: string, answerId: string) {
  for (let i = 0; i < 2; i++) {
    await commentOnAnswer(app, authToken, {
      answerId,
      content: `Test answer comment ${i + 1}`
    })
  }
}

describe('Fetch Answer Comments', () => {
  let authToken: string
  let answerId: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)

    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    const answerData = {
      questionId: createdQuestion.id,
      content: 'Test answer content'
    }
    await createAnswer(app, authToken, answerData)

    const questionDetails = await getQuestionBySlug(app, createdQuestion.slug, authToken)
    answerId = questionDetails.body.answers.items[0].id

    await makeCommentsForAnswer(app, authToken, answerId)
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await fetchAnswerComments(app, '', { answerId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 200 with paginated comments for existing answer', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, { answerId }, {
      page: 1,
      pageSize: 10
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems', 2)
    expect(httpResponse.body).toHaveProperty('totalPages', 1)
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items).toHaveLength(2)
  })

  it('should return empty list for non-existent answer', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, { answerId: uuidv7() })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items', [])
    expect(httpResponse.body).toHaveProperty('totalItems', 0)
    expect(httpResponse.body).toHaveProperty('totalPages', 0)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should use default pagination values when not provided', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, { answerId })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems', 2)
    expect(httpResponse.body).toHaveProperty('totalPages', 1)
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(httpResponse.body).toHaveProperty('items')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return 422 when pageSize exceeds maximum', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, { answerId }, {
      page: 1,
      pageSize: 101
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 422 when pageSize is zero', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, { answerId }, {
      page: 1,
      pageSize: 0
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should accept maximum valid pageSize', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, { answerId }, {
      page: 1,
      pageSize: 100
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('pageSize', 100)
  })
})
