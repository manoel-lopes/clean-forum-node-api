import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { createAnswer, deleteAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, fetchQuestions, getQuestionBySlug } from '../helpers/question-helpers'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Delete Answer Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authorToken: string
  let questionId: string
  let questionSlug: string
  let answerId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = generateUniqueUserData('Answer Author')
    await createUser(app, userData)
    const response = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    authorToken = response.body.token

    await createQuestion(app, authorToken, {
      title: 'Test question',
      content: 'Test question content'
    })

    const questionResponse = await fetchQuestions(app, authorToken)
    questionId = questionResponse.body.items[0].id
    questionSlug = questionResponse.body.items[0].slug

    await createAnswer(app, authorToken, {
      questionId,
      content: 'Test answer content'
    })

    const question = await getQuestionBySlug(app, questionSlug, authorToken)
    answerId = question.body.answers.items[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .delete('/answers/invalid-uuid')
      .set('Authorization', `Bearer ${authorToken}`)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId'
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const httpResponse = await request(app.server)
      .delete(`/answers/${uuidv7()}`)
      .set('Authorization', `Bearer ${authorToken}`)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found'
    })
  })

  it('should return 403 and an error response if the user is not the answer author', async () => {
    const userData = generateUniqueUserData('Other User')
    await createUser(app, userData)
    const response = await authenticateUser(app, {
      email: userData.email,
      password: userData.password
    })
    const otherUserToken = response.body.token

    const httpResponse = await deleteAnswer(app, otherUserToken, answerId)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the answer'
    })
  })

  it('should return 204 on successful answer deletion', async () => {
    // Create a new answer for deletion since previous test may have used the same one
    await createAnswer(app, authorToken, {
      questionId,
      content: 'Another test answer content for deletion'
    })

    // Get the new answer ID
    const questionDetails = await getQuestionBySlug(app, questionSlug, authorToken)
    const newAnswerId = questionDetails.body.answers.items.find((answer: { content: string }) =>
      answer.content === 'Another test answer content for deletion'
    ).id

    const httpResponse = await deleteAnswer(app, authorToken, newAnswerId)
    expect(httpResponse.statusCode).toBe(204)
  })
})
