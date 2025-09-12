import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { commentOnAnswer, createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { deleteAnswerComment } from '../helpers/comment-helpers'
import { makeAuthToken } from '../helpers/make-auth-token'
import { createQuestion, getQuestionBySlug, getQuestionByTile } from '../helpers/question-helpers'

async function setupTestEnvironment () {
  const app = await createTestApp()
  await app.ready()
  const authToken = await makeAuthToken(app)
  const otherUserToken = await makeAuthToken(app)
  return { app, authToken, otherUserToken }
}

async function makeQuestionWithAnswer (app: FastifyInstance, authToken: string) {
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

async function makeCommentOnAnswer (app: FastifyInstance, authToken: string, answerIdParam: string) {
  const commentResponse = await commentOnAnswer(app, authToken, {
    answerId: answerIdParam,
    content: 'Test comment content'
  })
  return commentResponse.body.id
}

async function makeTemporaryComment (app: FastifyInstance, authToken: string, answerId: string) {
  const response = await commentOnAnswer(app, authToken, {
    answerId,
    content: 'Comment to be deleted'
  })
  return response.body.id
}

describe('Delete Answer Comment', () => {
  let app: FastifyInstance
  let authToken: string
  let otherUserToken: string
  let answerId: string
  let commentId: string

  beforeAll(async () => {
    const setup = await setupTestEnvironment()
    app = setup.app
    authToken = setup.authToken
    otherUserToken = setup.otherUserToken

    answerId = await makeQuestionWithAnswer(app, authToken)
    commentId = await makeCommentOnAnswer(app, authToken, answerId)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await deleteAnswerComment(app, '', { commentId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 and an error response if the commentId format is invalid', async () => {
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

  it('should return 204 on successful comment deletion', async () => {
    const temporaryCommentId = await makeTemporaryComment(app, authToken, answerId)

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
