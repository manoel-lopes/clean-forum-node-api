import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import {
  createQuestion,
  createQuestionAttachment,
  getQuestionByTile,
  updateQuestion,
  updateQuestionAttachment,
} from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

async function setupQuestionWithAttachment () {
  const authToken = await makeAuthToken(app)
  const questionData = aQuestion().build()
  await createQuestion(app, authToken, questionData)
  const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
  const attachmentResponse = await createQuestionAttachment(app, authToken, {
    questionId: createdQuestion.id,
    title: 'Original Title',
    url: 'https://example.com/original.pdf',
  })
  return { authToken, attachmentId: attachmentResponse.body.id }
}

describe('[E2E] PATCH /questions', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  it('should return 401 if user is not authenticated', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const httpResponse = await updateQuestion(app, undefined, {
      questionId: createdQuestion.id,
      content: 'Updated content',
    })
    expect(httpResponse.statusCode).toBe(401)
  })

  it('should return 404 if question does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    const httpResponse = await updateQuestion(app, authToken, {
      questionId: nonExistentId,
      content: 'Updated content',
    })
    expect(httpResponse.statusCode).toBe(404)
  })

  it('should return 404 when attachment does not exist', async () => {
    const authToken = await makeAuthToken(app)
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    const response = await updateQuestionAttachment(app, authToken, {
      attachmentId: nonExistentId,
      title: 'New Title',
      url: 'https://example.com/test.pdf',
    })
    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when no fields are provided', async () => {
    const { authToken, attachmentId } = await setupQuestionWithAttachment()
    const response = await updateQuestionAttachment(app, authToken, {
      attachmentId,
    })
    expect(response.statusCode).toBe(422)
  })

  it('should update question title and content', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const httpResponse = await updateQuestion(app, authToken, {
      questionId: createdQuestion.id,
      title: 'Updated title',
      content: 'Updated content',
    })
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.question.title).toBe('Updated title')
    expect(httpResponse.body.question.content).toBe('Updated content')
  })

  it('should update attachment title', async () => {
    const { authToken, attachmentId } = await setupQuestionWithAttachment()
    const response = await updateQuestionAttachment(app, authToken, {
      attachmentId,
      title: 'Updated Title',
      url: 'https://example.com/original.pdf',
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: attachmentId,
      title: 'Updated Title',
      url: 'https://example.com/original.pdf',
    })
  })

  it('should update attachment link', async () => {
    const { authToken, attachmentId } = await setupQuestionWithAttachment()
    const response = await updateQuestionAttachment(app, authToken, {
      attachmentId,
      title: 'Original Title',
      url: 'https://example.com/updated.pdf',
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: attachmentId,
      title: 'Original Title',
      url: 'https://example.com/updated.pdf',
    })
  })

  it('should update both title and link', async () => {
    const { authToken, attachmentId } = await setupQuestionWithAttachment()
    const response = await updateQuestionAttachment(app, authToken, {
      attachmentId,
      title: 'New Title',
      url: 'https://example.com/new.pdf',
    })
    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: attachmentId,
      title: 'New Title',
      url: 'https://example.com/new.pdf',
    })
  })
})
