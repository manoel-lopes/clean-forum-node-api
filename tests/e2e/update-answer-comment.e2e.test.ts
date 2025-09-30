import type { FastifyInstance } from 'fastify'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { commentOnAnswer, createAnswer } from '../helpers/entities/answer-helpers'
import { fetchAnswerComments, updateAnswerComment } from '../helpers/entities/comment-helpers'
import {
  createQuestion,
  getQuestionBySlug,
  getQuestionByTile
} from '../helpers/entities/question-helpers'
import { app } from '../helpers/infrastructure/test-app'

async function makeAnswerCommentForQuestion (app: FastifyInstance, authToken: string) {
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  const questionId = createdQuestion.id

  await createAnswer(app, authToken, {
    questionId,
    content: 'Test answer content'
  })

  const questionDetails = await getQuestionBySlug(app, createdQuestion.slug, authToken)
  const answerId = questionDetails.body.answers.items[0].id

  await commentOnAnswer(app, authToken, {
    answerId,
    content: 'Original comment content'
  })

  const commentsResponse = await fetchAnswerComments(app, authToken, { answerId })
  const commentId = commentsResponse.body.items[0].id

  return { answerId, commentId }
}

describe('Update Answer Comment', () => {
  let authToken: string
  let otherUserToken: string
  let commentId: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
    otherUserToken = await makeAuthToken(app)

    const answerSetup = await makeAnswerCommentForQuestion(app, authToken)
    commentId = answerSetup.commentId
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const httpResponse = await updateAnswerComment(app, '', { commentId }, {
      content: 'Updated comment content'
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token'
    })
  })

  it('should return 400 when content is missing', async () => {
    const httpResponse = await updateAnswerComment(app, authToken, { commentId }, {})

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 when content is not a string', async () => {
    const httpResponse = await updateAnswerComment(app, authToken, { commentId }, {
      content: 123
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number"
    })
  })

  it('should return 404 when trying to update non-existent comment', async () => {
    const fakeCommentId = anAnswer().build().id
    const httpResponse = await updateAnswerComment(app, authToken, { commentId: fakeCommentId }, {
      content: 'Updated content'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found'
    })
  })

  it('should return 403 when trying to update comment as non-author', async () => {
    const httpResponse = await updateAnswerComment(app, otherUserToken, { commentId }, {
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
    const httpResponse = await updateAnswerComment(app, authToken, { commentId }, {
      content: updatedContent
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id', commentId)
    expect(httpResponse.body).toHaveProperty('content', updatedContent)
    expect(httpResponse.body).toHaveProperty('authorId')
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).toHaveProperty('updatedAt')
  })
})
