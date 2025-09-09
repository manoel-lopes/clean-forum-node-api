import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { createTestApp } from '../helpers/app-factory'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createQuestion, fetchQuestions } from '../helpers/question-helpers'

describe('Fetch Questions', () => {
  let app: FastifyInstance
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 and proper pagination structure', async () => {
    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(typeof httpResponse.body.totalItems).toBe('number')
    expect(httpResponse.body.totalItems >= 0).toBe(true)
  })

  it('should return 200 and paginated questions when questions exist', async () => {
    const question1Data = aQuestion().build()
    const question2Data = aQuestion().build()

    await createQuestion(app, authToken, question1Data)
    await createQuestion(app, authToken, question2Data)

    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(2)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body.totalItems).toBeGreaterThanOrEqual(2)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 10)
    expect(httpResponse.body).toHaveProperty('order', 'desc')

    // Validate question structure
    const firstQuestion = httpResponse.body.items[0]
    expect(firstQuestion).toHaveProperty('id')
    expect(typeof firstQuestion.id).toBe('string')
    expect(firstQuestion).toHaveProperty('title')
    expect(typeof firstQuestion.title).toBe('string')
    expect(firstQuestion).toHaveProperty('content')
    expect(typeof firstQuestion.content).toBe('string')
    expect(firstQuestion).toHaveProperty('slug')
    expect(typeof firstQuestion.slug).toBe('string')
    expect(firstQuestion).toHaveProperty('authorId')
    expect(typeof firstQuestion.authorId).toBe('string')
    expect(firstQuestion).toHaveProperty('createdAt')
    expect(firstQuestion).toHaveProperty('updatedAt')
    expect(firstQuestion).toHaveProperty('bestAnswerId', null)
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      perPage: 1
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 1)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(httpResponse.body).toHaveProperty('items')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items.length).toBeLessThanOrEqual(1)
  })

  it('should return 422 when pageSize exceeds maximum (101)', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      perPage: 101
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 422 when pageSize is zero', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      perPage: 0
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 100')
  })

  it('should return 422 when page is zero', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 0,
      perPage: 10
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page must be at least 1')
  })

  it('should accept maximum valid pageSize (100)', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      perPage: 100
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('pageSize', 100)
  })
})
