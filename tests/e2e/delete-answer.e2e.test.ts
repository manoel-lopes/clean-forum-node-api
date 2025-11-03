import { app } from '@/main/server'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer, deleteAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/domain/question-helpers'

describe('Delete Answer', () => {
  let authorToken: string
  let questionId: string
  let questionSlug: string
  let answerId: string

  beforeAll(async () => {
    authorToken = await makeAuthToken(app)

    const questionData = aQuestion().build()
    await createQuestion(app, authorToken, questionData)

    const question = await getQuestionByTile(app, authorToken, questionData.title)
    questionId = question.id
    questionSlug = question.slug

    await createAnswer(app, authorToken, {
      questionId,
      content: 'Test answer content',
    })

    const questionDetails = await getQuestionBySlug(app, questionSlug, authorToken)
    answerId = questionDetails.body.answers.items[0].id
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await deleteAnswer(app, '', {
      answerId,
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await deleteAnswer(app, authorToken, {
      answerId: 'invalid-uuid',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId',
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const answerData = anAnswer().build()

    const httpResponse = await deleteAnswer(app, authorToken, {
      answerId: answerData.id,
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 403 and an error response if the user is not the answer author', async () => {
    const otherUserToken = await makeAuthToken(app)

    const httpResponse = await deleteAnswer(app, otherUserToken, {
      answerId,
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the answer',
    })
  })

  it('should return 204 on successful answer deletion', async () => {
    const { body: answerData } = await createAnswer(app, authorToken, {
      questionId,
      content: 'Another test answer content for deletion',
    })

    const httpResponse = await deleteAnswer(app, authorToken, {
      answerId: answerData.id,
    })

    expect(httpResponse.statusCode).toBe(204)
  })
})
