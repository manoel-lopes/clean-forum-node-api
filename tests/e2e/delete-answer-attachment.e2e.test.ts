import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupAnswerWithAttachment () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  const answerData = anAnswer().build()
  const answerResponse = await createAnswer(app, authToken, {
    questionId: createdQuestion.id,
    content: answerData.content,
  })

  const attachmentResponse = await app.inject({
    method: 'POST',
    url: `/answers/${answerResponse.body.id}/attachments`,
    headers: { authorization: `Bearer ${authToken}` },
    payload: { title: 'Test Document', url: 'https://example.com/test.pdf' },
  })

  return { authToken, attachmentId: attachmentResponse.json().id }
}

describe('Delete Answer Attachment', () => {
  it('should delete an attachment', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()

    const response = await app.inject({
      method: 'DELETE',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    })

    expect(response.statusCode).toBe(204)

    const checkResponse = await app.inject({
      method: 'DELETE',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    })

    expect(checkResponse.statusCode).toBe(404)
  })

  it('should return 404 when attachment does not exist', async () => {
    const authToken = await makeAuthToken(app)
    const nonExistentId = '00000000-0000-0000-0000-000000000000'

    const response = await app.inject({
      method: 'DELETE',
      url: `/answers/attachments/${nonExistentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Attachment not found',
    })
  })

  it('should return 401 when user is not authenticated', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/answers/attachments/01936501-1234-7000-a000-000000000000',
    })

    expect(response.statusCode).toBe(401)
  })
})
