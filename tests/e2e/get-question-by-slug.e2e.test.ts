import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { createTestApp } from '../helpers/app-factory'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/question-helpers'

describe('Get Question By Slug', () => {
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

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const httpResponse = await getQuestionBySlug(app, slug, '')

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 200 and the question with answers', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    // Get the question slug by fetching question
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const response = await getQuestionBySlug(app, slug, authToken)

    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe(questionData.title)
    expect(response.body.content).toBe(questionData.content)
    expect(response.body.answers.items).toEqual([])
    expect(response.body.answers).toHaveProperty('page')
    expect(response.body.answers).toHaveProperty('pageSize')
    expect(response.body.answers).toHaveProperty('totalItems', 0)
    expect(response.body.answers).toHaveProperty('totalPages')
    expect(response.body.answers).toHaveProperty('order')
  })
})
