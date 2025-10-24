import { anAnswer } from '../builders/answer.builder'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { createAnswer } from '../helpers/domain/answer-helpers'
import { createQuestion, getQuestionByTile } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupAnswerForTest () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  const answerData = anAnswer().withContent().build()
  const answerResponse = await createAnswer(app, authToken, {
    questionId: createdQuestion.id,
    content: answerData.content,
  })
  return { authToken, answerId: answerResponse.body.id, questionId: createdQuestion.id }
}

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
    payload: { title: 'Original Title', url: 'https://example.com/original.pdf' },
  })
  return { authToken, attachmentId: attachmentResponse.json().id }
}

describe('[E2E] PATCH /answers', () => {
  it('should return 401 if user is not authenticated', async () => {
    const { answerId } = await setupAnswerForTest()
    const httpResponse = await app.inject({
      method: 'PATCH',
      url: `/answers/${answerId}`,
      payload: { content: 'Updated content' },
    })
    expect(httpResponse.statusCode).toBe(401)
  })

  it('should return 404 if answer does not exist', async () => {
    const authToken = await makeAuthToken(app)
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    const httpResponse = await app.inject({
      method: 'PATCH',
      url: `/answers/${nonExistentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: { content: 'Updated content' },
    })
    expect(httpResponse.statusCode).toBe(404)
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
        title: 'New Title',
        url: 'https://example.com/test.pdf',
      },
    })
    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when no fields are provided', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()
    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {},
    })
    expect(response.statusCode).toBe(422)
  })

  it('should update answer content', async () => {
    const { authToken, answerId } = await setupAnswerForTest()
    const httpResponse = await app.inject({
      method: 'PATCH',
      url: `/answers/${answerId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        content: 'Updated answer content',
      },
    })
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.json().answer.content).toBe('Updated answer content')
  })

  it('should update attachment title', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()
    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Updated Title',
        url: 'https://example.com/original.pdf',
      },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      id: attachmentId,
      title: 'Updated Title',
      url: 'https://example.com/original.pdf',
    })
  })

  it('should update attachment link', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()
    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'Original Title',
        url: 'https://example.com/updated.pdf',
      },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      id: attachmentId,
      title: 'Original Title',
      url: 'https://example.com/updated.pdf',
    })
  })

  it('should update both title and link', async () => {
    const { authToken, attachmentId } = await setupAnswerWithAttachment()
    const response = await app.inject({
      method: 'PATCH',
      url: `/answers/attachments/${attachmentId}`,
      headers: {
        authorization: `Bearer ${authToken}`,
      },
      payload: {
        title: 'New Title',
        url: 'https://example.com/new.pdf',
      },
    })
    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      id: attachmentId,
      title: 'New Title',
      url: 'https://example.com/new.pdf',
    })
  })
})
