import { uuidv7 } from 'uuidv7'
import type { Question } from '@/domain/entities/question/question.entity'
import { createAnswer } from '../helpers/answer-helpers'
import { createTestApp } from '../helpers/app-factory'
import {
  chooseQuestionBestAnswer,
  createQuestion,
  fetchQuestions,
  generateUniqueQuestionData,
  getQuestionBySlug
} from '../helpers/question-helpers'
import {
  authenticateUser,
  createUser,
  generateUniqueUserData
} from '../helpers/user-helpers'

describe('Choose Question Best Answer Route', () => {
  let app: Awaited<ReturnType<typeof createTestApp>>
  let authorToken: string
  let questionId: string
  let questionSlug: string
  let answerId: string

  beforeAll(async () => {
    app = await createTestApp()
    await app.ready()

    // Create author user and authenticate
    const authorUserData = generateUniqueUserData()
    await createUser(app, authorUserData)
    const authorAuthResponse = await authenticateUser(app, {
      email: authorUserData.email,
      password: authorUserData.password,
    })
    authorToken = authorAuthResponse.body.token

    // Create a question
    const questionData = generateUniqueQuestionData()
    await createQuestion(app, authorToken, questionData)

    // Get the question ID by fetching questions
    const fetchQuestionsResponse = await fetchQuestions(app, authorToken)
    const createdQuestion = fetchQuestionsResponse.body.items?.find((q: Question) => {
      return q.title === questionData.title
    })
    questionId = createdQuestion.id
    questionSlug = createdQuestion.slug

    // Create an answer for the question
    await createAnswer(app, authorToken, {
      questionId,
      content: 'Test answer content'
    })

    // Get the answer ID by fetching question details
    const questionDetails = await getQuestionBySlug(app, questionSlug, authorToken)
    const answers = questionDetails.body.answers.items
    answerId = answers[0].id
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return 422 and an error response if the answerId format is invalid', async () => {
    const httpResponse = await chooseQuestionBestAnswer(app, authorToken, {
      answerId: 'invalid-uuid'
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid answerId'
    })
  })

  it('should return 404 and an error response if the answer does not exist', async () => {
    const httpResponse = await chooseQuestionBestAnswer(app, authorToken, {
      answerId: uuidv7()
    })

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 403 and an error response if the user is not the question author', async () => {
    const otherUserData = generateUniqueUserData()
    await createUser(app, otherUserData)
    const otherAuthResponse = await authenticateUser(app, {
      email: otherUserData.email,
      password: otherUserData.password,
    })
    const otherUserToken = otherAuthResponse.body.token

    const httpResponse = await chooseQuestionBestAnswer(app, otherUserToken, {
      answerId
    })

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question'
    })
  })

  it('should return 200 on successful best answer selection', async () => {
    const httpResponse = await chooseQuestionBestAnswer(app, authorToken, {
      answerId
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('bestAnswerId', answerId)
    expect(httpResponse.body).toHaveProperty('id', questionId)
    expect(httpResponse.body).toHaveProperty('title')
    expect(httpResponse.body).toHaveProperty('content')
    expect(httpResponse.body).toHaveProperty('slug', questionSlug)
    expect(httpResponse.body).toHaveProperty('createdAt')
    expect(httpResponse.body).toHaveProperty('updatedAt')
    expect(httpResponse.body).toHaveProperty('authorId')
  })
})
