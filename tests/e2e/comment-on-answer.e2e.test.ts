import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { commentOnAnswer, createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, fetchQuestions, generateUniqueQuestionData, getQuestionBySlug } from '../helpers/question-helpers'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Comment on Answer Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let token: string
  let answerId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    // Create user and authenticate
    const userData = generateUniqueUserData('Answer Comment User')
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    token = authResponse.body.token

    // Create a question
    const questionData = generateUniqueQuestionData()
    await createQuestion(app, token, questionData)

    // Get the question ID by fetching questions
    const fetchQuestionsResponse = await fetchQuestions(app, token)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string }) => q.title === questionData.title)
    const questionId = createdQuestion.id

    // Create an answer
    await createAnswer(app, token, {
      questionId,
      content: 'Test answer content'
    })

    // Get the answer ID by fetching question details
    const questionDetails = await getQuestionBySlug(app, createdQuestion.slug, token)
    answerId = questionDetails.body.answers.items[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the answer id field is missing', async () => {
    // This test requires sending a request without the answerId field
    // so we use direct request instead of helper function
    const httpResponse = await request(app.server)
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment content'
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The answerId is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    // This test requires sending a request without the content field
    // so we use direct request instead of helper function
    const httpResponse = await request(app.server)
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answerId
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      answerId: 'invalid-uuid',
      content: 'Test comment content'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId'
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    // This test requires sending invalid data (number instead of string)
    // so we use direct request instead of helper function
    const httpResponse = await request(app.server)
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        answerId,
        content: 123
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Expected string for \'content\', received number'
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const nonExistentAnswerId = uuidv7()
    const httpResponse = await commentOnAnswer(app, token, {
      answerId: nonExistentAnswerId,
      content: 'Test comment content'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 201 on successful comment creation', async () => {
    const httpResponse = await commentOnAnswer(app, token, {
      answerId,
      content: 'Test comment content'
    })

    expect(httpResponse.statusCode).toBe(201)
  })
})
