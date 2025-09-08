import type { FastifyInstance } from 'fastify'
import type { Question } from '@/domain/entities/question/question.entity'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { commentOnAnswer, createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { fetchAnswerComments, updateAnswerComment } from '../helpers/comment-helpers'
import {
  createQuestion,
  fetchQuestions,
  getQuestionBySlug
} from '../helpers/question-helpers'
import {
  authenticateUser,
  createUser
} from '../helpers/user-helpers'

describe('Update Answer Comment', () => {
  let app: FastifyInstance
  let authToken: string
  let otherUserToken: string
  let answerId: string
  let commentId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    // Create first user (comment author)
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token

    // Create second user (not comment author)
    const otherUserData = aUser().build()
    await createUser(app, otherUserData)
    const otherAuthResponse = await authenticateUser(app, {
      email: otherUserData.email,
      password: otherUserData.password,
    })
    otherUserToken = otherAuthResponse.body.token

    // Create a question
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    // Get the question ID by fetching questions
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: Question) => {
      return q.title === questionData.title
    })
    const questionId = createdQuestion.id

    // Create an answer
    await createAnswer(app, authToken, {
      questionId,
      content: 'Test answer content'
    })

    // Get the answer ID by fetching question details
    const questionDetails = await getQuestionBySlug(app, createdQuestion.slug, authToken)
    answerId = questionDetails.body.answers.items[0].id

    // Create a comment to update
    await commentOnAnswer(app, authToken, {
      answerId,
      content: 'Original comment content'
    })

    // Get the comment ID by fetching answer comments
    const commentsResponse = await fetchAnswerComments(app, authToken, answerId)
    commentId = commentsResponse.body.items[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 when content is missing', async () => {
    const httpResponse = await updateAnswerComment(app, authToken, commentId, {})

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 when content is not a string', async () => {
    const httpResponse = await updateAnswerComment(app, authToken, commentId, {
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
    const httpResponse = await updateAnswerComment(app, authToken, fakeCommentId, {
      content: 'Updated content'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found'
    })
  })

  it('should return 403 when trying to update comment as non-author', async () => {
    const httpResponse = await updateAnswerComment(app, otherUserToken, commentId, {
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
    const httpResponse = await updateAnswerComment(app, authToken, commentId, {
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
