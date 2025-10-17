import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { authenticateUser } from '../helpers/auth/session-helpers'
import { commentOnQuestion, createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { createUser } from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'

describe('Comment on Question', () => {
  let authToken: string
  let questionId: string

  beforeAll(async () => {
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token

    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    questionId = createdQuestion.id
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await commentOnQuestion(app, '', {
      questionId,
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required',
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required',
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId: 'invalid-uuid',
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId',
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId,
      content: 123,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number",
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const questionData = aQuestion().build()
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId: questionData.id,
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful comment creation', async () => {
    const questionData = aQuestion().build()
    const createResponse = await createQuestion(app, authToken, questionData)

    const testQuestionId = createResponse.body?.id
      ? createResponse.body.id
      : (await getQuestionByTile(app, authToken, questionData.title)).id

    const commentData = {
      questionId: testQuestionId,
      content: 'Test comment content',
    }
    const httpResponse = await commentOnQuestion(app, authToken, commentData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
