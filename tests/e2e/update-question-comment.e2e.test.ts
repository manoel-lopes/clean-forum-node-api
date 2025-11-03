import { uuidv7 } from 'uuidv7'
import { app } from '@/main/server'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { updateQuestionComment } from '../helpers/domain/comment-helpers'
import { commentOnQuestion, createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'

describe('Update Question Comment', () => {
  let authToken: string
  let otherUserToken: string
  let questionId: string
  let commentId: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
    otherUserToken = await makeAuthToken(app)

    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    questionId = createdQuestion.id

    const commentResponse = await commentOnQuestion(app, authToken, {
      questionId,
      content: 'Original comment content',
    })

    commentId = commentResponse.body.id
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await updateQuestionComment(
      app,
      '',
      { commentId },
      {
        content: 'Updated comment content',
      }
    )

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 400 when content is missing', async () => {
    const httpResponse = await updateQuestionComment(app, authToken, { commentId }, {})

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required',
    })
  })

  it('should return 422 when content is not a string', async () => {
    const httpResponse = await updateQuestionComment(
      app,
      authToken,
      { commentId },
      {
        content: 123,
      }
    )

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number",
    })
  })

  it('should return 404 when trying to update non-existent comment', async () => {
    const fakeCommentId = uuidv7()
    const httpResponse = await updateQuestionComment(
      app,
      authToken,
      { commentId: fakeCommentId },
      {
        content: 'Updated content',
      }
    )

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found',
    })
  })

  it('should return 403 when trying to update comment as non-author', async () => {
    const httpResponse = await updateQuestionComment(
      app,
      otherUserToken,
      { commentId },
      {
        content: 'Updated content',
      }
    )

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the comment',
    })
  })

  it('should return 200 and update the comment on successful update', async () => {
    const updatedContent = 'This is the updated comment content'
    const httpResponse = await updateQuestionComment(
      app,
      authToken,
      { commentId },
      {
        content: updatedContent,
      }
    )

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id', commentId)
    expect(httpResponse.body).toHaveProperty('content', updatedContent)
    expect(httpResponse.body).toHaveProperty('authorId')
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).toHaveProperty('updatedAt')
  })
})
