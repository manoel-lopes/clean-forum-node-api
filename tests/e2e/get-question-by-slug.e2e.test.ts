import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

describe('Get Question By Slug', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
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
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const httpResponse = await getQuestionBySlug(app, slug, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.title).toBe(questionData.title)
    expect(httpResponse.body.content).toBe(questionData.content)
    expect(httpResponse.body.answers.items).toEqual([])
    expect(httpResponse.body.answers).toHaveProperty('page')
    expect(httpResponse.body.answers).toHaveProperty('pageSize')
    expect(httpResponse.body.answers).toHaveProperty('totalItems', 0)
    expect(httpResponse.body.answers).toHaveProperty('totalPages')
    expect(httpResponse.body.answers).toHaveProperty('order')
  })

  it('should return 429 when rate limit is exceeded', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const promises = []
    for (let i = 0; i < 305; i++) {
      promises.push(getQuestionBySlug(app, slug, authToken))
    }

    const responses = await Promise.all(promises)

    const rateLimitedResponse = responses.find(r => r.statusCode === 429)
    expect(rateLimitedResponse).toBeDefined()
    expect(rateLimitedResponse?.body).toEqual({
      code: 'READ_OPERATION_RATE_LIMIT_EXCEEDED',
      error: 'Too Many Requests',
      message: 'Too many read operations. Please try again later.',
    })
  }, 30000) // 30s timeout for this test
})
