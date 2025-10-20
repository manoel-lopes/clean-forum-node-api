import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { attachToAnswer, commentOnAnswer, createAnswer, fetchQuestionAnswers } from '../helpers/domain/answer-helpers'
import { createQuestion } from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

describe('Fetch Question Answers', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  async function createTestQuestion () {
    const questionData = aQuestion().build()
    const response = await createQuestion(app, authToken, questionData)
    return response.body.id
  }

  it('should return 200 and proper pagination structure', async () => {
    const questionId = await createTestQuestion()

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 20)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
  })

  it('should return 422 for invalid include values', async () => {
    const questionId = await createTestQuestion()

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, {
      include: 'invalid,wrong',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error', 'Unprocessable Entity')
    expect(httpResponse.body.message).toContain('Invalid request')
  })

  it('should accept valid include values', async () => {
    const questionId = await createTestQuestion()

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, {
      include: 'comments,attachments,author',
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
  })

  it('should accept single valid include value', async () => {
    const questionId = await createTestQuestion()

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, {
      include: 'author',
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
  })

  it('should return 422 when mixing valid and invalid include values', async () => {
    const questionId = await createTestQuestion()

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, {
      include: 'author,invalid',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error', 'Unprocessable Entity')
    expect(httpResponse.body.message).toContain('Invalid request')
  })

  it('should return answers with comments when include=comments', async () => {
    const questionId = await createTestQuestion()
    const answerResponse = await createAnswer(app, authToken, {
      questionId,
      content: 'This is an answer',
    })
    const answerId = answerResponse.body.id

    await commentOnAnswer(app, authToken, {
      answerId,
      content: 'First comment on answer',
    })

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, { include: 'comments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const answerWithComment = httpResponse.body.items.find((a: { id: string }) => a.id === answerId)
    expect(answerWithComment).toBeDefined()
    expect(answerWithComment.comments).toBeDefined()
    expect(Array.isArray(answerWithComment.comments)).toBe(true)
    expect(answerWithComment.comments.length).toBeGreaterThanOrEqual(1)
    expect(answerWithComment.comments[0]).toHaveProperty('content')
    expect(answerWithComment.comments[0]).toHaveProperty('authorId')
  })

  it('should return answers with attachments when include=attachments', async () => {
    const questionId = await createTestQuestion()
    const answerResponse = await createAnswer(app, authToken, {
      questionId,
      content: 'Answer with attachment',
    })
    const answerId = answerResponse.body.id

    await attachToAnswer(app, authToken, {
      answerId,
      title: 'Test attachment',
      url: 'https://example.com/file.pdf',
    })

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, { include: 'attachments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const answerWithAttachment = httpResponse.body.items.find((a: { id: string }) => a.id === answerId)
    expect(answerWithAttachment).toBeDefined()
    expect(answerWithAttachment.attachments).toBeDefined()
    expect(Array.isArray(answerWithAttachment.attachments)).toBe(true)
    expect(answerWithAttachment.attachments.length).toBeGreaterThanOrEqual(1)
    expect(answerWithAttachment.attachments[0]).toHaveProperty('title')
    expect(answerWithAttachment.attachments[0]).toHaveProperty('url')
  })

  it('should return answers with author when include=author', async () => {
    const questionId = await createTestQuestion()
    await createAnswer(app, authToken, {
      questionId,
      content: 'Answer with author',
    })

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, { include: 'author' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items.length).toBeGreaterThan(0)

    const answerWithAuthor = httpResponse.body.items[0]
    expect(answerWithAuthor.author).toBeDefined()
    expect(answerWithAuthor.author).toHaveProperty('id')
    expect(answerWithAuthor.author).toHaveProperty('name')
    expect(answerWithAuthor.author).toHaveProperty('email')
  })

  it('should return answers with all includes when multiple specified', async () => {
    const questionId = await createTestQuestion()
    const answerResponse = await createAnswer(app, authToken, {
      questionId,
      content: 'Answer with all includes',
    })
    const answerId = answerResponse.body.id

    await commentOnAnswer(app, authToken, {
      answerId,
      content: 'Test comment',
    })

    await attachToAnswer(app, authToken, {
      answerId,
      title: 'Test attachment',
      url: 'https://example.com/file.pdf',
    })

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, {
      include: 'comments,attachments,author',
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const answerWithAllIncludes = httpResponse.body.items.find((a: { id: string }) => a.id === answerId)
    expect(answerWithAllIncludes).toBeDefined()
    expect(answerWithAllIncludes.comments).toBeDefined()
    expect(Array.isArray(answerWithAllIncludes.comments)).toBe(true)
    expect(answerWithAllIncludes.attachments).toBeDefined()
    expect(Array.isArray(answerWithAllIncludes.attachments)).toBe(true)
    expect(answerWithAllIncludes.author).toBeDefined()
    expect(answerWithAllIncludes.author).toHaveProperty('id')
    expect(answerWithAllIncludes.author).toHaveProperty('name')
  })

  it('should return answers without optional fields when include not specified', async () => {
    const questionId = await createTestQuestion()
    const answerResponse = await createAnswer(app, authToken, {
      questionId,
      content: 'Answer without includes',
    })
    const answerId = answerResponse.body.id

    await commentOnAnswer(app, authToken, {
      answerId,
      content: 'Test comment',
    })

    await attachToAnswer(app, authToken, {
      answerId,
      title: 'Test attachment',
      url: 'https://example.com/file.pdf',
    })

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const answerWithoutIncludes = httpResponse.body.items.find((a: { id: string }) => a.id === answerId)
    expect(answerWithoutIncludes).toBeDefined()
    expect(answerWithoutIncludes.comments).toBeUndefined()
    expect(answerWithoutIncludes.attachments).toBeUndefined()
    expect(answerWithoutIncludes.author).toBeUndefined()
  })

  it('should handle empty comments array when include=comments specified', async () => {
    const questionId = await createTestQuestion()
    const answerResponse = await createAnswer(app, authToken, {
      questionId,
      content: 'Answer without comments',
    })
    const answerId = answerResponse.body.id

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, { include: 'comments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()

    const answerWithNoComments = httpResponse.body.items.find((a: { id: string }) => a.id === answerId)
    expect(answerWithNoComments).toBeDefined()
    expect(answerWithNoComments.comments).toBeDefined()
    expect(Array.isArray(answerWithNoComments.comments)).toBe(true)
    expect(answerWithNoComments.comments).toHaveLength(0)
  })

  it('should handle empty attachments array when include=attachments specified', async () => {
    const questionId = await createTestQuestion()
    const answerResponse = await createAnswer(app, authToken, {
      questionId,
      content: 'Answer without attachments',
    })
    const answerId = answerResponse.body.id

    const httpResponse = await fetchQuestionAnswers(app, questionId, authToken, { include: 'attachments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()

    const answerWithNoAttachments = httpResponse.body.items.find((a: { id: string }) => a.id === answerId)
    expect(answerWithNoAttachments).toBeDefined()
    expect(answerWithNoAttachments.attachments).toBeDefined()
    expect(Array.isArray(answerWithNoAttachments.attachments)).toBe(true)
    expect(answerWithNoAttachments.attachments).toHaveLength(0)
  })

  it('should return 404 when question does not exist', async () => {
    const httpResponse = await fetchQuestionAnswers(app, '01936723-d85f-7c84-8e73-6e05a30f3f50', authToken)

    expect(httpResponse.statusCode).toBe(404)
  })
})
