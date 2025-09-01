import { uuidv7 } from 'uuidv7'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { commentOnAnswer, createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { fetchAnswerComments } from '../helpers/comment-helpers'
import { createQuestion, fetchQuestions } from '../helpers/question-helpers'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Fetch Answer Comments Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string
  let answerId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    // Create user
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token

    // Create a question first
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string; id: string }) => q.title === questionData.title)

    // Create an answer
    const answerData = {
      questionId: createdQuestion.id,
      content: 'Test answer content'
    }
    await createAnswer(app, authToken, answerData)

    // Since createAnswer doesn't return the ID, use a valid UUID for testing
    answerId = uuidv7()

    // Create some comments for testing
    for (let i = 0; i < 2; i++) {
      await commentOnAnswer(app, authToken, {
        answerId,
        content: `Test answer comment ${i + 1}`
      })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 with paginated comments for existing answer', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, answerId, {
      page: 1,
      perPage: 10
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return empty list for non-existent answer', async () => {
    const nonExistentAnswerId = uuidv7()
    const httpResponse = await fetchAnswerComments(app, authToken, nonExistentAnswerId)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toEqual([])
    expect(httpResponse.body.totalItems).toBe(0)
  })

  it('should use default pagination values when not provided', async () => {
    const httpResponse = await fetchAnswerComments(app, authToken, answerId)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
  })
})
