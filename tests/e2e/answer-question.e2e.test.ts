import type { FastifyInstance } from 'fastify'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createQuestion, getQuestionByTile } from '../helpers/question-helpers'

describe('Answer Question', () => {
  let app: FastifyInstance
  let authToken: string
  let questionId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)

    // Create a question
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    // Get the question ID by fetching question
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    questionId = createdQuestion.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const answerData = anAnswer()
      .withContent()
      .build()
    delete answerData.questionId

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const answerData = anAnswer()
      .withQuestionId(questionId)
      .build()
    delete answerData.content

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const answerData = anAnswer()
      .withQuestionId('invalid-question-id')
      .withContent()
      .build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const answerData = anAnswer()
      .withQuestionId(questionId)
      .withContent(123)
      .build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number"
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const questionData = aQuestion().build()
    const answerData = anAnswer()
      .withQuestionId(questionData.id)
      .withContent()
      .build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful answer creation', async () => {
    const answerData = anAnswer()
      .withQuestionId(questionId)
      .withContent()
      .build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
