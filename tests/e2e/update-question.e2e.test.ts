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
    payload: { title: 'Original Title', link: 'https://example.com/original.pdf' }
  })
  return { authToken, attachmentId: attachmentResponse.json().id }
}

describe('Update Question', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  describe('Update Question Entity', () => {
    it('should return 401 if user is not authenticated', async () => {
      const questionData = aQuestion().build()
      const createResponse = await createQuestion(app, authToken, questionData)
      const questionId = createResponse.body.id
      const httpResponse = await app.inject({
        method: 'PATCH',
        url: `/questions/${questionId}`,
        payload: { content: 'Updated content' }
      })
      expect(httpResponse.statusCode).toBe(401)
    })

    it('should return 404 if question does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const httpResponse = await app.inject({
        method: 'PATCH',
        url: `/questions/${nonExistentId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: { content: 'Updated content' }
      })
      expect(httpResponse.statusCode).toBe(404)
    })

    it('should update question title and content', async () => {
      const questionData = aQuestion().build()
      const createResponse = await createQuestion(app, authToken, questionData)
      const questionId = createResponse.body.id
      const httpResponse = await app.inject({
        method: 'PATCH',
        url: `/questions/${questionId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          title: 'Updated title',
          content: 'Updated content'
        }
      })
      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.json().question.title).toBe('Updated title')
      expect(httpResponse.json().question.content).toBe('Updated content')
    })
  })

  describe('Update Question Attachment', () => {
    it('should update attachment title', async () => {
      const { authToken, attachmentId } = await setupQuestionWithAttachment()
      const response = await app.inject({
        method: 'PATCH',
        url: `/questions/attachments/${attachmentId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          title: 'Updated Title',
          link: 'https://example.com/original.pdf'
        }
      })
      expect(response.statusCode).toBe(200)
      expect(response.json()).toMatchObject({
        id: attachmentId,
        title: 'Updated Title',
        link: 'https://example.com/original.pdf'
      })
    })

    it('should update attachment link', async () => {
      const { authToken, attachmentId } = await setupQuestionWithAttachment()
      const response = await app.inject({
        method: 'PATCH',
        url: `/questions/attachments/${attachmentId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          title: 'Original Title',
          link: 'https://example.com/updated.pdf'
        }
      })
      expect(response.statusCode).toBe(200)
      expect(response.json()).toMatchObject({
        id: attachmentId,
        title: 'Original Title',
        link: 'https://example.com/updated.pdf'
      })
    })

    it('should update both title and link', async () => {
      const { authToken, attachmentId } = await setupQuestionWithAttachment()
      const response = await app.inject({
        method: 'PATCH',
        url: `/questions/attachments/${attachmentId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          title: 'New Title',
          link: 'https://example.com/new.pdf'
        }
      })
      expect(response.statusCode).toBe(200)
      expect(response.json()).toMatchObject({
        id: attachmentId,
        title: 'New Title',
        link: 'https://example.com/new.pdf'
      })
    })

    it('should return 404 when attachment does not exist', async () => {
      const authToken = await makeAuthToken(app)
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const response = await app.inject({
        method: 'PATCH',
        url: `/questions/attachments/${nonExistentId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {
          title: 'New Title',
          link: 'https://example.com/test.pdf'
        }
      })
      expect(response.statusCode).toBe(404)
    })

    it('should return 400 when no fields are provided', async () => {
      const { authToken, attachmentId } = await setupQuestionWithAttachment()
      const response = await app.inject({
        method: 'PATCH',
        url: `/questions/attachments/${attachmentId}`,
        headers: {
          authorization: `Bearer ${authToken}`
        },
        payload: {}
      })
      expect(response.statusCode).toBe(422)
    })
  })
})
