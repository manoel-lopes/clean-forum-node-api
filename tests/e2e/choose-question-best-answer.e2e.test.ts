import { anAnswer } from 'tests/builders/answer.builder'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import {
  chooseQuestionBestAnswer,
  createQuestion,
  getQuestionBySlug,
  getQuestionByTile
} from '../helpers/question-helpers'
import { authenticateUser } from '../helpers/session-helpers'
import { createUser } from '../helpers/user-helpers'

describe('Choose Question Best Answer', () => {
  let app: FastifyInstance
  let authorToken: string
  let questionId: string
  let questionSlug: string
  let answerId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    // Create author user and authenticate
    const authorUserData = aUser().build()
    await createUser(app, authorUserData)
    const authorAuthResponse = await authenticateUser(app, {
      email: authorUserData.email,
      password: authorUserData.password,
    })
    authorToken = authorAuthResponse.body.token

    // Create a question
    const questionData = aQuestion().build()
    await createQuestion(app, authorToken, questionData)

    // Get the question ID by fetching question
    const createdQuestion = await getQuestionByTile(app, authorToken, questionData.title)
    questionId = createdQuestion.id
    questionSlug = createdQuestion.slug

    const answerData = anAnswer()
      .withQuestionId(questionId)
      .withContent()
      .build()
    await createAnswer(app, authorToken, answerData)

    // Get the answer ID by fetching question details
    const questionDetails = await getQuestionBySlug(app, questionSlug, authorToken)
    const answers = questionDetails.body.answers.items
    answerId = answers[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await chooseQuestionBestAnswer(app, '', {
      answerId
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await chooseQuestionBestAnswer(app, authorToken, {
      answerId: 'invalid-uuid'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId'
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const answerData = anAnswer().build()

    const httpResponse = await chooseQuestionBestAnswer(app, authorToken, {
      answerId: answerData.id
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 403 and an error response if the user is not the question author', async () => {
    const otherUserData = aUser().build()
    await createUser(app, otherUserData)
    const otherAuthResponse = await authenticateUser(app, {
      email: otherUserData.email,
      password: otherUserData.password,
    })
    const otherUserToken = otherAuthResponse.body.token

    const httpResponse = await chooseQuestionBestAnswer(app, otherUserToken, {
      answerId
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question'
    })
  })

  it('should return 200 on successful best answer selection', async () => {
    const httpResponse = await chooseQuestionBestAnswer(app, authorToken, {
      answerId
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('bestAnswerId', answerId)
    expect(httpResponse.body).toHaveProperty('id', questionId)
    expect(httpResponse.body).toHaveProperty('title')
    expect(httpResponse.body).toHaveProperty('content')
    expect(httpResponse.body).toHaveProperty('slug', questionSlug)
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).toHaveProperty('updatedAt')
    expect(httpResponse.body).toHaveProperty('authorId')
  })
})
