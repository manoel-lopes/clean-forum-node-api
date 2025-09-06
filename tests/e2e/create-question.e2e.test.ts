import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion } from '../helpers/question-helpers'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Create Question Route', () => {
  let app: FastifyInstance
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = aUser().build()
    await createUser(app, userData)
    const response = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    authToken = response.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the title field is missing', async () => {
    const questionData = aQuestion().build()
    delete questionData.title

    const httpResponse = await createQuestion(app, authToken, questionData)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The title is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const questionData = aQuestion().build()
    delete questionData.content

    const httpResponse = await createQuestion(app, authToken, questionData)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 409 and an error response if the question title is already registered', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const httpResponse = await createQuestion(app, authToken, questionData)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({
      error: 'Conflict',
      message: 'Question with title already registered'
    })
  })

  it('should return 201 on successful question creation', async () => {
    const questionData = aQuestion().build()

    const httpResponse = await createQuestion(app, authToken, questionData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
