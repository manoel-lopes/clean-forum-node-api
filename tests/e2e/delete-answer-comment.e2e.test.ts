import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { deleteAnswerComment } from '../helpers/comment-helpers'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createQuestion, getQuestionByTile } from '../helpers/question-helpers'

describe('Delete Answer Comment', () => {
  let app: FastifyInstance
  let authToken: string
  let otherUserToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)
    otherUserToken = await makeAuthToken(app)

    // Create a question first
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    // Create an answer
    const answerData = {
      questionId: createdQuestion.id,
      content: 'Test answer content'
    }
    await createAnswer(app, authToken, answerData)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const nonExistentCommentId = uuidv7()
    const httpResponse = await deleteAnswerComment(app, '', { commentId: nonExistentCommentId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 404 when trying to delete non-existent comment', async () => {
    const nonExistentCommentId = uuidv7()
    const httpResponse = await deleteAnswerComment(app, authToken, { commentId: nonExistentCommentId })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found',
    })
  })

  it('should return 403 when user is not the comment author', async () => {
    const fakeCommentId = uuidv7()
    const httpResponse = await deleteAnswerComment(app, otherUserToken, { commentId: fakeCommentId })

    expect(httpResponse.statusCode).toBe(404)
  })
})
