import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { commentOnAnswer, createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { deleteAnswerComment } from '../helpers/comment-helpers'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/question-helpers'

describe('Delete Answer Comment', () => {
  let app: FastifyInstance
  let authToken: string
  let otherUserToken: string
  let answerId: string
  let commentId: string

  async function setupTestEnvironment () {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)
    otherUserToken = await makeAuthToken(app)
  }

  async function createQuestionWithAnswer () {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    await createAnswer(app, authToken, {
      questionId: createdQuestion.id,
      content: 'Test answer content'
    })

    const questionDetails = await getQuestionBySlug(app, createdQuestion.slug, authToken)
    return questionDetails.body.answers.items[0].id
  }

  async function createCommentOnAnswer (answerIdParam: string) {
    const commentResponse = await commentOnAnswer(app, authToken, {
      answerId: answerIdParam,
      content: 'Test comment content'
    })
    return commentResponse.body.id
  }

  beforeAll(async () => {
    await setupTestEnvironment()
    answerId = await createQuestionWithAnswer()
    commentId = await createCommentOnAnswer(answerId)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error httpResponse if the user is not authenticated', async () => {
    const httpResponse = await deleteAnswerComment(app, '', { commentId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 and an error httpResponse if the commentId format is invalid', async () => {
    const httpResponse = await deleteAnswerComment(app, authToken, {
      commentId: 'invalid-uuid'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid commentId'
    })
  })

  it('should return 404 when trying to delete non-existent comment', async () => {
    const httpResponse = await deleteAnswerComment(app, authToken, { commentId: uuidv7() })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found'
    })
  })

  it('should return 403 when user is not the comment author', async () => {
    const httpResponse = await deleteAnswerComment(app, otherUserToken, { commentId })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the comment'
    })
  })

  async function createTemporaryComment () {
    const response = await commentOnAnswer(app, authToken, {
      answerId,
      content: 'Comment to be deleted'
    })
    return response.body.id
  }

  it('should return 204 on successful comment deletion', async () => {
    const temporaryCommentId = await createTemporaryComment()

    const httpResponse = await deleteAnswerComment(app, authToken, { commentId: temporaryCommentId })

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should allow answer author to delete any comment on their answer', async () => {
    const commentByOtherUser = await commentOnAnswer(app, otherUserToken, {
      answerId,
      content: 'Comment by another user'
    })
    const otherUserCommentId = commentByOtherUser.body.id

    const httpResponse = await deleteAnswerComment(app, authToken, { commentId: otherUserCommentId })

    expect(httpResponse.statusCode).toBe(204)
  })
})
