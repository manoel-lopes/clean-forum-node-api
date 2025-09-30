import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { fetchQuestionComments } from '../helpers/domain/comment-helpers'
import { commentOnQuestion, createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function makeCommentsForQuestion (app: FastifyInstance, authToken: string, questionId: string) {
  for (let i = 0; i < 3; i++) {
    await commentOnQuestion(app, authToken, {
      questionId,
      content: `Test comment ${i + 1}`
    })
  }
}

describe('Fetch Question Comments', () => {
  let authToken: string
  let questionId: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    questionId = createdQuestion.id

    await makeCommentsForQuestion(app, authToken, questionId)
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await fetchQuestionComments(app, '', { questionId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 200 with paginated comments for existing question', async () => {
    const httpResponse = await fetchQuestionComments(app, authToken, { questionId }, {
      page: 1,
      pageSize: 10
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems', 3)
    expect(httpResponse.body).toHaveProperty('totalPages', 1)
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items).toHaveLength(3)

    const firstComment = httpResponse.body.items[0]
    expect(firstComment).toHaveProperty('id')
    expect(typeof firstComment.id).toBe('string')
    expect(firstComment).toHaveProperty('content')
    expect(typeof firstComment.content).toBe('string')
    expect(firstComment.content).toMatch(/Test comment/)
    expect(firstComment).toHaveProperty('authorId')
    expect(typeof firstComment.authorId).toBe('string')
    expect(firstComment).toHaveProperty('questionId', questionId)
    expect(firstComment).toHaveProperty('createdAt')
    expect(firstComment).toHaveProperty('updatedAt')
  })

  it('should return empty list for non-existent question', async () => {
    const nonExistentQuestionId = uuidv7()
    const httpResponse = await fetchQuestionComments(app, authToken, { questionId: nonExistentQuestionId })

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
    const httpResponse = await fetchQuestionComments(app, authToken, { questionId })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems', 3)
    expect(httpResponse.body).toHaveProperty('totalPages', 1)
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(httpResponse.body).toHaveProperty('items')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return 422 when pageSize exceeds maximum', async () => {
    const httpResponse = await fetchQuestionComments(app, authToken, { questionId }, {
      page: 1,
      pageSize: 101
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 422 when pageSize is zero', async () => {
    const httpResponse = await fetchQuestionComments(app, authToken, { questionId }, {
      page: 1,
      pageSize: 0
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should accept maximum valid pageSize', async () => {
    const httpResponse = await fetchQuestionComments(app, authToken, { questionId }, {
      page: 1,
      pageSize: 100
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('pageSize', 100)
  })
})
