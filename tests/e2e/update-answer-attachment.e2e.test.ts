import { app } from '@/main/server'
import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../factories/infra/make-auth-token'
import { createAnswer } from '../helpers/domain/enterprise/answers/answer-requests'
import { createQuestion, getQuestionByTile } from '../helpers/domain/enterprise/questions/question-requests'

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

describe('Update Answer Attachment', () => {
  it('should return 200 when updating an attachment', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()

    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Updated Document',
        url: 'https://example.com/updated.pdf',
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      id: attachmentId,
      title: 'Updated Document',
      url: 'https://example.com/updated.pdf',
    })
  })

  it('should return 404 when attachment does not exist', async () => {
    const authToken = await makeAuthToken(app)
    const nonExistentId = '00000000-0000-0000-0000-000000000000'

    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${nonExistentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Updated Document',
        url: 'https://example.com/updated.pdf',
      },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Attachment not found',
    })
  })

  it('should return 400 when title is missing', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()

    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        url: 'https://example.com/updated.pdf',
      },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 422 when url is not a valid URL', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()

    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Updated Document',
        url: 'not-a-valid-url',
      },
    })

    expect(response.statusCode).toBe(422)
  })

  it('should return 401 when user is not authenticated', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/answers/attachments/01936501-1234-7000-a000-000000000000',
      payload: {
        title: 'Updated Document',
        url: 'https://example.com/updated.pdf',
      },
    })

    expect(response.statusCode).toBe(401)
  })
})
