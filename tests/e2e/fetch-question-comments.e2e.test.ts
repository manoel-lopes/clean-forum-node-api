import { uuidv7 } from 'uuidv7'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { fetchQuestionComments } from '../helpers/comment-helpers'
import { commentOnQuestion, createQuestion, fetchQuestions } from '../helpers/question-helpers'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Fetch Question Comments Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string
  let questionId: string

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

    // Create a question
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string; id: string }) => q.title === questionData.title)
    questionId = createdQuestion.id

    // Create some comments for testing
    for (let i = 0; i < 3; i++) {
      await commentOnQuestion(app, authToken, {
        questionId,
        content: `Test comment ${i + 1}`
      })
    }
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 200 with paginated comments for existing question', async () => {
    const httpResponse = await fetchQuestionComments(app, authToken, questionId, {
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

  it('should return empty list for non-existent question', async () => {
    const nonExistentQuestionId = uuidv7()
    const httpResponse = await fetchQuestionComments(app, authToken, nonExistentQuestionId)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toEqual([])
    expect(httpResponse.body.totalItems).toBe(0)
  })

  it('should use default pagination values when not provided', async () => {
    const httpResponse = await fetchQuestionComments(app, authToken, questionId)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page')
    expect(httpResponse.body).toHaveProperty('pageSize')
  })
})
