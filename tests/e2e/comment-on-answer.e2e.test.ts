import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { authenticateUser } from '../helpers/auth/session-helpers'
import { commentOnAnswer, createAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/domain/question-helpers'
import { createUser } from '../helpers/domain/user-helpers'
import { app } from '../helpers/infra/test-app'

describe('Comment on Answer', () => {
  let token: string
  let answerId: string

  beforeAll(async () => {
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    token = authResponse.body.token

    const questionData = aQuestion().build()
    await createQuestion(app, token, questionData)

    const createdQuestion = await getQuestionByTile(app, token, questionData.title)
    const questionId = createdQuestion.id

    await createAnswer(app, token, {
      questionId,
      content: 'Test answer content',
    })

    const questionDetails = await getQuestionBySlug(app, createdQuestion.slug, token)
    answerId = questionDetails.body.answers.items[0].id
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await commentOnAnswer(app, '', {
      answerId,
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 400 and an error response if the answer id field is missing', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The answerId is required',
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      answerId,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required',
    })
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      answerId: 'invalid-uuid',
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId',
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      answerId,
      content: 123,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number",
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const answerData = anAnswer().build()

    const httpResponse = await commentOnAnswer(app, token, {
      answerId: answerData.id,
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 201 on successful comment creation', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      answerId,
      content: 'Test comment content',
    })

    expect(httpResponse.statusCode).toBe(201)
  })
})
