import { uuidv7 } from 'uuidv7'
import request from 'supertest'
import { createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, fetchQuestions, generateUniqueQuestionData } from '../helpers/question-helpers'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Answer Question Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string
  let questionId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    // Create user and authenticate
    const userData = generateUniqueUserData('Auth User for Answers')
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token

    // Create a question
    const questionData = generateUniqueQuestionData()
    await createQuestion(app, authToken, questionData)

    // Get the question ID by fetching questions
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string }) => q.title === questionData.title)
    questionId = createdQuestion.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId
      })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId: 'invalid-question-id',
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId,
        content: 123
      })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number"
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const httpResponse = await request(app.server)
      .post('/answers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        questionId: uuidv7(),
        content: 'Test answer content'
      })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful answer creation', async () => {
    const answerData = {
      questionId,
      content: 'Test answer content'
    }
    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
