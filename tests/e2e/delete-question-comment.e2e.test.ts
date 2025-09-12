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

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    authToken = await makeAuthToken(app)
    otherUserToken = await makeAuthToken(app)

    // Create a question
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    questionId = createdQuestion.id

    // Create a comment and get its ID from the response
    const commentResponse = await commentOnQuestion(app, authToken, {
      questionId,
      content: 'Test comment content'
    })
    commentId = commentResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await deleteQuestionComment(app, '', { commentId })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 422 and an error response if the commentId format is invalid', async () => {
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

  it('should return 204 on successful comment deletion', async () => {
    // Create another comment for deletion test
    const commentResponse = await commentOnQuestion(app, authToken, {
      questionId,
      content: 'Comment to be deleted'
    })
    const commentToDeleteId = commentResponse.body.id

    const httpResponse = await deleteQuestionComment(app, authToken, { commentId: commentToDeleteId })

    expect(httpResponse.statusCode).toBe(204)
  })
})
