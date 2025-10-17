import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer } from '../helpers/domain/answer-helpers'
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
      message: 'Invalid token',
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

  it('should return question with answers and author data efficiently', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug
    const questionId = createdQuestion.id

    const answerRequests = []
    for (let i = 0; i < 5; i++) {
      answerRequests.push(
        createAnswer(app, authToken, {
          questionId,
          content: `Answer ${i + 1} with sufficient content to test query optimization`,
        }),
      )
    }
    await Promise.all(answerRequests)

    const startTime = Date.now()
    const httpResponse = await getQuestionBySlug(app, slug, authToken)
    const duration = Date.now() - startTime

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.answers.items).toHaveLength(5)
    expect(httpResponse.body.answers.items[0]).toHaveProperty('author')
    expect(httpResponse.body.answers.items[0].author).toHaveProperty('name')
    expect(httpResponse.body.answers.items[0].author).toHaveProperty('email')
    expect(duration).toBeLessThan(500)
  })
})
