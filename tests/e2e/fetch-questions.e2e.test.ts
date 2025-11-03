import { app } from '@/main/server'
import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import {
  attachToQuestion,
  commentOnQuestion,
  createQuestion,
  fetchQuestions,
  getQuestionByTile,
} from '../helpers/domain/question-helpers'

describe('Fetch Questions', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  it('should return 200 and proper pagination structure', async () => {
    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 20)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(typeof httpResponse.body.totalItems).toBe('number')
    expect(httpResponse.body.totalItems >= 0).toBe(true)
  })

  it('should return 200 and paginated questions when questions exist', async () => {
    const question1Data = aQuestion().build()
    const question2Data = aQuestion().build()

    await createQuestion(app, authToken, question1Data)
    await createQuestion(app, authToken, question2Data)

    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items.length).toBeGreaterThanOrEqual(2)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body.totalItems).toBeGreaterThanOrEqual(2)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 20)
    expect(httpResponse.body).toHaveProperty('order', 'desc')

    const firstQuestion = httpResponse.body.items[0]
    expect(firstQuestion).toHaveProperty('id')
    expect(typeof firstQuestion.id).toBe('string')
    expect(firstQuestion).toHaveProperty('title')
    expect(typeof firstQuestion.title).toBe('string')
    expect(firstQuestion).toHaveProperty('content')
    expect(typeof firstQuestion.content).toBe('string')
    expect(firstQuestion).toHaveProperty('slug')
    expect(typeof firstQuestion.slug).toBe('string')
    expect(firstQuestion).toHaveProperty('authorId')
    expect(typeof firstQuestion.authorId).toBe('string')
    expect(firstQuestion).toHaveProperty('createdAt')
    expect(firstQuestion).toHaveProperty('updatedAt')
    expect(firstQuestion).toHaveProperty('bestAnswerId', null)
  })

  it('should return 200 with pagination parameters', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      pageSize: 1,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('page', 1)
    expect(httpResponse.body).toHaveProperty('pageSize', 1)
    expect(httpResponse.body).toHaveProperty('totalItems')
    expect(httpResponse.body).toHaveProperty('totalPages')
    expect(httpResponse.body).toHaveProperty('order', 'desc')
    expect(httpResponse.body).toHaveProperty('items')
    expect(Array.isArray(httpResponse.body.items)).toBe(true)
    expect(httpResponse.body.items.length).toBeLessThanOrEqual(1)
  })

  it('should return 422 when pageSize exceeds maximum (51)', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      pageSize: 51,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 50')
  })

  it('should return 422 when pageSize is zero', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      pageSize: 0,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page size must be between 1 and 50')
  })

  it('should return 422 when page is zero', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 0,
      pageSize: 10,
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error')
    expect(httpResponse.body.message).toContain('Page must be at least 1')
  })

  it('should accept maximum valid pageSize (50)', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      page: 1,
      pageSize: 50,
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('pageSize', 50)
  })

  it('should return 422 for invalid include values', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      include: 'invalid,wrong',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error', 'Unprocessable Entity')
    expect(httpResponse.body.message).toContain('Invalid include values')
  })

  it('should accept valid include values', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      include: 'comments,attachments,author',
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
  })

  it('should accept single valid include value', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      include: 'author',
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('items')
  })

  it('should return 422 when mixing valid and invalid include values', async () => {
    const httpResponse = await fetchQuestions(app, authToken, {
      include: 'author,invalid',
    })

    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toHaveProperty('error', 'Unprocessable Entity')
    expect(httpResponse.body.message).toContain('Invalid include values: invalid')
  })

  it('should return questions with comments when include=comments', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    await commentOnQuestion(app, authToken, {
      questionId: createdQuestion.id,
      content: 'First comment on question',
    })

    const httpResponse = await fetchQuestions(app, authToken, { include: 'comments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const questionWithComment = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithComment).toBeDefined()
    expect(questionWithComment.comments).toBeDefined()
    expect(Array.isArray(questionWithComment.comments)).toBe(true)
    expect(questionWithComment.comments.length).toBeGreaterThanOrEqual(1)
    expect(questionWithComment.comments[0]).toHaveProperty('content')
    expect(questionWithComment.comments[0]).toHaveProperty('authorId')
  })

  it('should return questions with attachments when include=attachments', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    await attachToQuestion(app, authToken, {
      questionId: createdQuestion.id,
      title: 'Test attachment',
      url: 'https://example.com/file.pdf',
    })

    const httpResponse = await fetchQuestions(app, authToken, { include: 'attachments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const questionWithAttachment = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithAttachment).toBeDefined()
    expect(questionWithAttachment.attachments).toBeDefined()
    expect(Array.isArray(questionWithAttachment.attachments)).toBe(true)
    expect(questionWithAttachment.attachments.length).toBeGreaterThanOrEqual(1)
    expect(questionWithAttachment.attachments[0]).toHaveProperty('title')
    expect(questionWithAttachment.attachments[0]).toHaveProperty('url')
  })

  it('should return questions with author when include=author', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    const httpResponse = await fetchQuestions(app, authToken, { include: 'author' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const questionWithAuthor = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithAuthor).toBeDefined()
    expect(questionWithAuthor.author).toBeDefined()
    expect(questionWithAuthor.author).toHaveProperty('id')
    expect(questionWithAuthor.author).toHaveProperty('name')
    expect(questionWithAuthor.author).toHaveProperty('email')
  })

  it('should return questions with all includes when multiple specified', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    await commentOnQuestion(app, authToken, {
      questionId: createdQuestion.id,
      content: 'Test comment',
    })

    await attachToQuestion(app, authToken, {
      questionId: createdQuestion.id,
      title: 'Test attachment',
      url: 'https://example.com/file.pdf',
    })

    const httpResponse = await fetchQuestions(app, authToken, {
      include: 'comments,attachments,author',
    })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const questionWithAllIncludes = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithAllIncludes).toBeDefined()
    expect(questionWithAllIncludes.comments).toBeDefined()
    expect(Array.isArray(questionWithAllIncludes.comments)).toBe(true)
    expect(questionWithAllIncludes.attachments).toBeDefined()
    expect(Array.isArray(questionWithAllIncludes.attachments)).toBe(true)
    expect(questionWithAllIncludes.author).toBeDefined()
    expect(questionWithAllIncludes.author).toHaveProperty('id')
    expect(questionWithAllIncludes.author).toHaveProperty('name')
  })

  it('should return questions without optional fields when include not specified', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    await commentOnQuestion(app, authToken, {
      questionId: createdQuestion.id,
      content: 'Test comment',
    })

    await attachToQuestion(app, authToken, {
      questionId: createdQuestion.id,
      title: 'Test attachment',
      url: 'https://example.com/file.pdf',
    })

    const httpResponse = await fetchQuestions(app, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()
    expect(Array.isArray(httpResponse.body.items)).toBe(true)

    const questionWithoutIncludes = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithoutIncludes).toBeDefined()
    expect(questionWithoutIncludes.comments).toBeUndefined()
    expect(questionWithoutIncludes.attachments).toBeUndefined()
    expect(questionWithoutIncludes.author).toBeUndefined()
  })

  it('should handle empty comments array when include=comments specified', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    const httpResponse = await fetchQuestions(app, authToken, { include: 'comments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()

    const questionWithNoComments = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithNoComments).toBeDefined()
    expect(questionWithNoComments.comments).toBeDefined()
    expect(Array.isArray(questionWithNoComments.comments)).toBe(true)
    expect(questionWithNoComments.comments).toHaveLength(0)
  })

  it('should handle empty attachments array when include=attachments specified', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)

    const httpResponse = await fetchQuestions(app, authToken, { include: 'attachments' })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.items).toBeDefined()

    const questionWithNoAttachments = httpResponse.body.items.find((q: { id: string }) => q.id === createdQuestion.id)
    expect(questionWithNoAttachments).toBeDefined()
    expect(questionWithNoAttachments.attachments).toBeDefined()
    expect(Array.isArray(questionWithNoAttachments.attachments)).toBe(true)
    expect(questionWithNoAttachments.attachments).toHaveLength(0)
  })
})
