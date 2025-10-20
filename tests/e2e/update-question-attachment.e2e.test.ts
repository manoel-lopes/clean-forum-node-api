import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupQuestionWithAttachment () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

  const attachmentResponse = await app.inject({
    method: 'POST',
    url: `/questions/${createdQuestion.id}/attachments`,
    headers: { authorization: `Bearer ${authToken}` },
    payload: { title: 'Test Document', url: 'https://example.com/test.pdf' },
  })

  return { authToken, attachmentId: attachmentResponse.json().id }
}

describe('Update Question Attachment', () => {
  it('should update an attachment', async () => {
    const { authToken, attachmentId } = await setupQuestionWithAttachment()

    const response = await app.inject({
      method: 'PATCH',
      url: `/questions/attachments/${attachmentId}`,
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
      url: `/questions/attachments/${nonExistentId}`,
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
    const { authToken, attachmentId } = await setupQuestionWithAttachment()

    const response = await app.inject({
      method: 'PATCH',
      url: `/questions/attachments/${attachmentId}`,
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
    const { authToken, attachmentId } = await setupQuestionWithAttachment()

    const response = await app.inject({
      method: 'PATCH',
      url: `/questions/attachments/${attachmentId}`,
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
      url: '/questions/attachments/01936501-1234-7000-a000-000000000000',
      payload: {
        title: 'Updated Document',
        url: 'https://example.com/updated.pdf',
      },
    })

    expect(response.statusCode).toBe(401)
  })
})
