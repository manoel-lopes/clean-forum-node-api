import { app } from '@/main/server'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createQuestion } from '../helpers/domain/question-helpers'

describe('Create Question', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const questionData = aQuestion().build()

    const httpResponse = await createQuestion(app, '', questionData)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 400 and an error response if the title field is missing', async () => {
    const questionData = aQuestion().build()

    const httpResponse = await createQuestion(app, authToken, {
      content: questionData.content,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The title is required',
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const questionData = aQuestion().build()
    delete questionData.content

    const httpResponse = await createQuestion(app, authToken, {
      title: questionData.title,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required',
    })
  })

  it('should return 409 and an error response if the question title is already registered', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const httpResponse = await createQuestion(app, authToken, questionData)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({
      error: 'Conflict',
      message: 'Question with title already registered',
    })
  })

  it('should return 201 on successful question creation', async () => {
    const questionData = aQuestion().build()

    const httpResponse = await createQuestion(app, authToken, questionData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
