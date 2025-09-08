import type { FastifyInstance } from 'fastify'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import { fetchQuestionComments, updateQuestionComment } from '../helpers/comment-helpers'
import {
  commentOnQuestion,
  createQuestion,
  getQuestionByTile
} from '../helpers/question-helpers'
import {
  authenticateUser,
  createUser
} from '../helpers/user-helpers'

async function makeAuthToken (app: FastifyInstance) {
  const userData = aUser().build()
  await createUser(app, userData)
  const authResponse = await authenticateUser(app, {
    email: userData.email,
    password: userData.password,
  })
  return authResponse.body.token
}

describe('Update Question Comment', () => {
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
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    // Get the question ID by fetching question
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    questionId = createdQuestion.id

    // Create a comment to update
    await commentOnQuestion(app, authToken, {
      questionId,
      content: 'Original comment content'
    })

    // Get the comment ID by fetching question comments
    const commentsResponse = await fetchQuestionComments(app, authToken, questionId)
    commentId = commentsResponse.body.items[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 when content is missing', async () => {
    const httpResponse = await updateQuestionComment(app, authToken, commentId, {})

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 when content is not a string', async () => {
    const httpResponse = await updateQuestionComment(app, authToken, commentId, {
      content: 123
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number"
    })
  })

  it('should return 404 when trying to update non-existent comment', async () => {
    const fakeCommentId = aQuestion().build().id
    const httpResponse = await updateQuestionComment(app, authToken!, fakeCommentId!, {
      content: 'Updated content'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found'
    })
  })

  it('should return 403 when trying to update comment as non-author', async () => {
    const httpResponse = await updateQuestionComment(app, otherUserToken, commentId, {
      content: 'Updated content'
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the comment'
    })
  })

  it('should return 200 and update the comment on successful update', async () => {
    const updatedContent = 'This is the updated comment content'
    const httpResponse = await updateQuestionComment(app, authToken, commentId, {
      content: updatedContent
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id', commentId)
    expect(httpResponse.body).toHaveProperty('content', updatedContent)
    expect(httpResponse.body).toHaveProperty('authorId')
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).toHaveProperty('updatedAt')

    // Verify the comment was actually updated
    const commentsResponse = await fetchQuestionComments(app, authToken, questionId)
    const updatedComment = commentsResponse.body.items.find((c: { id: string }) => c.id === commentId)
    expect(updatedComment.content).toBe(updatedContent)
  })
})
