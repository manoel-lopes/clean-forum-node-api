import { uuidv7 } from 'uuidv7'
import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { createTestApp } from '../helpers/app-factory'
import { deleteQuestionComment } from '../helpers/comment-helpers'
import { makeAuthToken } from '../helpers/make-auth-token'
import { commentOnQuestion, createQuestion, getQuestionByTile } from '../helpers/question-helpers'

describe('Delete Question Comment', () => {
  let app: FastifyInstance
  let authToken: string
  let otherUserToken: string
  let questionId: string
  let commentId: string

  async function setupTestEnvironment () {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)
    otherUserToken = await makeAuthToken(app)
  }

  async function createQuestionForTesting () {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    return createdQuestion.id
  }

  async function createCommentOnQuestion (questionIdParam: string) {
    const commentResponse = await commentOnQuestion(app, authToken, {
      questionId: questionIdParam,
      content: 'Test comment content'
    })
    return commentResponse.body.id
  }

  beforeAll(async () => {
    await setupTestEnvironment()
    questionId = await createQuestionForTesting()
    commentId = await createCommentOnQuestion(questionId)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error httpResponse if the user is not authenticated', async () => {
    const httpResponse = await deleteQuestionComment(app, '', { commentId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 and an error httpResponse if the commentId format is invalid', async () => {
    const httpResponse = await deleteQuestionComment(app, authToken, {
      commentId: 'invalid-uuid'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid commentId'
    })
  })

  it('should return 404 when trying to delete non-existent comment', async () => {
    const nonExistentCommentId = uuidv7()
    const httpResponse = await deleteQuestionComment(app, authToken, { commentId: nonExistentCommentId })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found'
    })
  })

  it('should return 403 when user is not the comment author', async () => {
    const httpResponse = await deleteQuestionComment(app, otherUserToken, { commentId })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the comment'
    })
  })

  async function createTemporaryComment () {
    const response = await commentOnQuestion(app, authToken, {
      questionId,
      content: 'Comment to be deleted'
    })
    return response.body.id
  }

  it('should return 204 on successful comment deletion', async () => {
    const temporaryCommentId = await createTemporaryComment()

    const httpResponse = await deleteQuestionComment(app, authToken, { commentId: temporaryCommentId })

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should allow question author to delete any comment on their question', async () => {
    const commentByOtherUser = await commentOnQuestion(app, otherUserToken, {
      questionId,
      content: 'Comment by another user'
    })
    const otherUserCommentId = commentByOtherUser.body.id

    const httpResponse = await deleteQuestionComment(app, authToken, { commentId: otherUserCommentId })

    expect(httpResponse.statusCode).toBe(204)
  })
})
