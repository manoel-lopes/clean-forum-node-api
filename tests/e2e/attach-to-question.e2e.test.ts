import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupQuestionForTest () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  return { authToken, questionId: createdQuestion.id }
}

describe('Attach to Question', () => {
  it('should attach a file to a question', async () => {
    const { authToken, questionId } = await setupQuestionForTest()

    const response = await app.inject({
      method: 'POST',
      url: `/questions/${questionId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`
      },
      payload: {
        title: 'Test Document',
        link: 'https://example.com/document.pdf'
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      questionId,
      title: 'Test Document',
      link: 'https://example.com/document.pdf'
    })
  })

  it('should return 404 when question does not exist', async () => {
    const authToken = await makeAuthToken(app)
    const nonExistentQuestionId = '00000000-0000-0000-0000-000000000000'

    const response = await app.inject({
      method: 'POST',
      url: `/questions/${nonExistentQuestionId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`
      },
      payload: {
        title: 'Test Document',
        link: 'https://example.com/document.pdf'
      }
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Question not found'
    })
  })

  it('should return 400 when title is missing', async () => {
    const { authToken, questionId } = await setupQuestionForTest()

    const response = await app.inject({
      method: 'POST',
      url: `/questions/${questionId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`
      },
      payload: {
        link: 'https://example.com/document.pdf'
      }
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 422 when link is not a valid URL', async () => {
    const { authToken, questionId } = await setupQuestionForTest()

    const response = await app.inject({
      method: 'POST',
      url: `/questions/${questionId}/attachments`,
      headers: {
        authorization: `Bearer ${authToken}`
      },
      payload: {
        title: 'Test Document',
        link: 'not-a-valid-url'
      }
    })

    expect(response.statusCode).toBe(422)
  })
})
