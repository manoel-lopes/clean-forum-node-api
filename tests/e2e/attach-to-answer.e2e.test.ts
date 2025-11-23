import { app } from '@/main/server'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../factories/infra/make-auth-token'
import { createAnswer } from '../helpers/domain/enterprise/answers/answer-requests'
import { createQuestion, getQuestionByTile } from '../helpers/domain/enterprise/questions/question-requests'

async function setupAnswerForTest () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  const answerData = anAnswer().build()
  const answerResponse = await createAnswer(app, authToken, {
    questionId: createdQuestion.id,
    content: answerData.content,
  })
  const createdAnswer = answerResponse.body
  return { authToken, answerId: createdAnswer.id }
}

describe('Attach to Answer', () => {
  it('should return 201 when attaching a file to an answer', async () => {
    const { authToken, answerId } = await setupAnswerForTest()

    const response = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Test Document',
        url: 'https://example.com/document.pdf',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      answerId,
      title: 'Test Document',
      url: 'https://example.com/document.pdf',
    })
  })

  it('should return 404 when answer does not exist', async () => {
    const authToken = await makeAuthToken(app)
    const nonExistentAnswerId = '00000000-0000-0000-0000-000000000000'

    const response = await app.inject({
      method: 'POST',
      url: `/answers/${nonExistentAnswerId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Test Document',
        url: 'https://example.com/document.pdf',
      },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 400 when title is missing', async () => {
    const { authToken, answerId } = await setupAnswerForTest()

    const response = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        url: 'https://example.com/document.pdf',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 422 when url is not a valid URL', async () => {
    const { authToken, answerId } = await setupAnswerForTest()

    const response = await app.inject({
      method: 'POST',
      url: `/answers/${answerId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Test Document',
        url: 'not-a-valid-url',
      },
    })

    expect(response.statusCode).toBe(422)
  })
})
