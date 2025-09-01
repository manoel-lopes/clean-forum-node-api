import type { Question } from '@/domain/entities/question/question.entity'
import { aQuestion } from '../builders/question.builder'
import { aUser } from '../builders/user.builder'
import { createTestApp } from '../helpers/app-factory'
import {
  commentOnQuestion,
  createQuestion,
  fetchQuestions
} from '../helpers/question-helpers'
import {
  authenticateUser,
  createUser
} from '../helpers/user-helpers'

describe('Comment on Question Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authToken: string
  let questionId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    //
    const userData = aUser().build()
    await createUser(app, userData)
    const authResponse = await authenticateUser(app, {
      email: userData.email,
      password: userData.password,
    })
    authToken = authResponse.body.token

    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)

    // Get the question ID by fetching questions
    const fetchQuestionsResponse = await fetchQuestions(app, authToken)
    const createdQuestion = fetchQuestionsResponse.body.items.find((q: Question) => {
      return q.title === questionData.title
    })
    questionId = createdQuestion.id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      content: 'Test comment content'
    }, questionId)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required'
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required'
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId: 'invalid-uuid',
      content: 'Test comment content'
    }, 'invalid-uuid')

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId'
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId,
      content: 123
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Expected string for \'content\', received number'
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const questionData = aQuestion().build()
    const httpResponse = await commentOnQuestion(app, authToken, {
      questionId: questionData.id,
      content: 'Test comment content'
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful comment creation', async () => {
    // Create a fresh question for this specific test
    const questionData = aQuestion().build()
    const createResponse = await createQuestion(app, authToken, questionData)

    // Get the question ID from the create response if available, or fetch it
    let testQuestionId: string
    if (createResponse.body?.id) {
      testQuestionId = createResponse.body.id
    } else {
      const fetchQuestionsResponse = await fetchQuestions(app, authToken)
      const createdQuestion = fetchQuestionsResponse.body.items.find((q: { title: string }) => q.title === questionData.title)
      testQuestionId = createdQuestion.id
    }

    const commentData = {
      questionId: testQuestionId,
      content: 'Test comment content'
    }
    const httpResponse = await commentOnQuestion(app, authToken, commentData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
