import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { authenticateUser } from '../helpers/auth/session-helpers'
import {
  createQuestion,
  deleteQuestion,
  getQuestionByTile
} from '../helpers/entities/question-helpers'
import { createUser } from '../helpers/entities/user-helpers'
import { app } from '../helpers/infrastructure/test-app'

describe('Delete Question', () => {
  let authToken: string

  beforeAll(async () => {
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const questionData = aQuestion().withId().build()

    const httpResponse = await deleteQuestion(app, '', {
      questionId: questionData.id!
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await deleteQuestion(app, authToken, {
      questionId: 'invalid-question-id'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const questionData = aQuestion().withId().build()

    const httpResponse = await deleteQuestion(app, authToken, {
      questionId: questionData.id!
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 403 and an error response if the user is not the author', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const notAuthorData = aUser().build()
    await createUser(app, notAuthorData)
    const { body: { token: notAuthorToken } } = await authenticateUser(app, notAuthorData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const questionId = createdQuestion.id

    const httpResponse = await deleteQuestion(app, notAuthorToken, {
      questionId
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question',
    })
  })

  it('should return 204 on successful question deletion', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const questionId = createdQuestion.id

    const httpResponse = await deleteQuestion(app, authToken, {
      questionId
    })

    expect(httpResponse.statusCode).toBe(204)
  })
})
