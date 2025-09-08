import type { FastifyInstance } from 'fastify'
import type { Question } from '@/domain/entities/question/question.entity'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createAnswer, deleteAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, fetchQuestions, getQuestionBySlug } from '../helpers/question-helpers'
import { authenticateUser, createUser } from '../helpers/user-helpers'

describe('Delete Answer', () => {
  let app: FastifyInstance
  let authorToken: string
  let questionId: string
  let questionSlug: string
  let answerId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = aUser().withName('Answer Author').build()
    await createUser(app, userData)
    const response = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    authorToken = response.body.token

    const questionData = aQuestion().build()
    await createQuestion(app, authorToken, questionData)

    const fetchQuestionResponse = await fetchQuestions(app, authorToken)
    const question = fetchQuestionResponse.body.items.find((q: Question) => {
      return q.title === questionData.title
    })
    questionId = question.id
    questionSlug = question.slug

    await createAnswer(app, authorToken, {
      questionId,
      content: 'Test answer content'
    })

    const questionDetails = await getQuestionBySlug(app, questionSlug, authorToken)
    answerId = questionDetails.body.answers.items[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await deleteAnswer(app, authorToken, {
      answerId: 'invalid-uuid'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId'
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const answerData = anAnswer().build()
    const httpResponse = await deleteAnswer(app, authorToken, {
      answerId: answerData.id
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found'
    })
  })

  it('should return 403 and an error response if the user is not the answer author', async () => {
    const userData = aUser().withName('Other User').build()
    await createUser(app, userData)
    const response = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    const otherUserToken = response.body.token

    const httpResponse = await deleteAnswer(app, otherUserToken, {
      answerId
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the answer'
    })
  })

  it('should return 204 on successful answer deletion', async () => {
    const answerContent = 'Another test answer content for deletion'
    await createAnswer(app, authorToken, {
      questionId,
      content: answerContent
    })
    const questionDetails = await getQuestionBySlug(app, questionSlug, authorToken)
    const newAnswerId = questionDetails.body.answers.items.find((answer: { content: string }) =>
      answer.content === answerContent
    ).id

    const httpResponse = await deleteAnswer(app, authorToken, {
      answerId: newAnswerId
    })

    expect(httpResponse.statusCode).toBe(204)
  })
})
