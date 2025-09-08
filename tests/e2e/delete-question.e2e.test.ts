import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import {
  createQuestion,
  deleteQuestion,
  getQuestionByTile
} from '../helpers/question-helpers'
import {
  authenticateUser,
  createUser
} from '../helpers/user-helpers'

describe('Delete Question', () => {
  let app: FastifyInstance
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
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
    const createResponse = await createQuestion(app, authToken, questionData)

    const notAuthorData = aUser().build()
    await createUser(app, notAuthorData)
    const notAuthorAuthResponse = await authenticateUser(app, {
      email: notAuthorData.email,
      password: notAuthorData.password,
    })

    // Get the question ID from the create response if available, or fetch it
    let questionId: string
    if (createResponse.body?.id) {
      questionId = createResponse.body.id
    } else {
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      questionId = createdQuestion.id
    }

    const httpResponse = await deleteQuestion(app, notAuthorAuthResponse.body.token, {
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
    const createResponse = await createQuestion(app, authToken, questionData)

    // Get the question ID from the create response if available, or fetch it
    let questionId: string
    if (createResponse.body?.id) {
      questionId = createResponse.body.id
    } else {
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      questionId = createdQuestion.id
    }

    const httpResponse = await deleteQuestion(app, authToken, {
      questionId
    })

    expect(httpResponse.statusCode).toBe(204)
  })
})
