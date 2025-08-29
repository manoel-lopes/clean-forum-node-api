import request from 'supertest'
import { createTestApp } from '../helpers/app-factory'
import { createQuestion, deleteQuestion, fetchQuestions, generateUniqueQuestionData } from '../helpers/question-helpers'
import { authenticateUser, createUser, generateUniqueUserData } from '../helpers/user-helpers'

describe('Delete Question Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    const userData = generateUniqueUserData('Auth User for Questions')
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await request(app.server)
      .delete('/questions/invalid-question-id')
      .set('Authorization', `Bearer ${authToken}`)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const httpResponse = await deleteQuestion(app, authToken, '123e4567-e89b-12d3-a456-426614174000')

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 403 and an error response if the user is not the author', async () => {
    const questionData = generateUniqueQuestionData()
    await createQuestion(app, authToken, questionData)

    const notAuthorData = generateUniqueUserData('Not Author User')
    await createUser(app, notAuthorData)
    const notAuthorAuthResponse = await authenticateUser(app, {
      email: notAuthorData.email,
      password: notAuthorData.password,
    })

    // Since createQuestion doesn't return the question data, we need to fetch it
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string }) => q.title === questionData.title)

    const httpResponse = await deleteQuestion(app, notAuthorAuthResponse.body.token, createdQuestion.id)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question',
    })
  })

  it('should return 204 on successful question deletion', async () => {
    const questionData = generateUniqueQuestionData()
    await createQuestion(app, authToken, questionData)

    // Since createQuestion doesn't return the question data, we need to fetch it
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string }) => q.title === questionData.title)

    const httpResponse = await deleteQuestion(app, authToken, createdQuestion.id)

    expect(httpResponse.statusCode).toBe(204)
  })
})
