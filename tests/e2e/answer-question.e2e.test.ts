import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupQuestionForTest() {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  return { authToken, questionId: createdQuestion.id }
}

describe('Answer Question', () => {
  it('should return 401 and an error response if the user is not authenticated', async () => {
    const { questionId } = await setupQuestionForTest()
    const invalidToken = ''
    const answerData = anAnswer().withContent().build()

    const httpResponse = await createAnswer(app, invalidToken, {
      questionId,
      content: answerData.content,
    })

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 400 and an error response if the question id field is missing', async () => {
    const { authToken } = await setupQuestionForTest()
    const answerData = anAnswer().withContent().build()

    const httpResponse = await createAnswer(app, authToken, {
      content: answerData.content,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The questionId is required',
    })
  })

  it('should return 400 and an error response if the content field is missing', async () => {
    const { authToken, questionId } = await setupQuestionForTest()

    const httpResponse = await createAnswer(app, authToken, {
      questionId,
    })

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The content is required',
    })
  })

  it('should return 422 and an error response if the questionId format is invalid', async () => {
    const { authToken } = await setupQuestionForTest()
    const answerData = anAnswer().withQuestionId('invalid-question-id').withContent().build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: 'Invalid questionId',
    })
  })

  it('should return 422 and an error response if the content is not a string', async () => {
    const { authToken, questionId } = await setupQuestionForTest()
    const answerData = anAnswer().withQuestionId(questionId).withContent(123).build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual({
      error: 'Unprocessable Entity',
      message: "Expected string for 'content', received number",
    })
  })

  it('should return 404 and an error response if the question does not exist', async () => {
    const { authToken } = await setupQuestionForTest()
    const nonExistentQuestionId = aQuestion().build().id
    const answerData = anAnswer().withQuestionId(nonExistentQuestionId).withContent().build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 201 on successful answer creation', async () => {
    const { authToken, questionId } = await setupQuestionForTest()
    const answerData = anAnswer().withQuestionId(questionId).withContent().build()

    const httpResponse = await createAnswer(app, authToken, answerData)

    expect(httpResponse.statusCode).toBe(201)
  })
})
