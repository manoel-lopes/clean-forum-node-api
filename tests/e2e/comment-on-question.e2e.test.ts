import { uuidv7 } from 'uuidv7'
import { createTestApp } from '../helpers/app-factory'
import { commentOnQuestion, createQuestion, fetchQuestions, generateUniqueQuestionData } from '../helpers/question-helpers'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Comment on Question Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string
  let questionId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = generateUniqueUserData('Auth User for Comments')
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })

    authToken = authResponse.body.token

    const questionData = generateUniqueQuestionData()
    await createQuestion(app, authToken, questionData)

    // Get the question ID by fetching questions
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string }) => q.title === questionData.title)
    questionId = createdQuestion.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      content: 'Test comment content'
    }, questionId)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId: 'invalid-uuid',
      content: 'Test comment content'
    }, 'invalid-uuid')

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId,
      content: 123
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Expected string for \'content\', received number'
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const nonExistentQuestionId = uuidv7()
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId: nonExistentQuestionId,
      content: 'Test comment content'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful comment creation', async () => {
    const commentData = {
      questionId,
      content: 'Test comment content'
    }
    const httpResponse = await commentOnQuestion(app, authToken, commentData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
