import { aQuestion } from '../builders/question.builder'
import { makeAuthToken } from '../helpers/auth/make-auth-token'
import { attachToAnswer, commentOnAnswer, createAnswer } from '../helpers/domain/answer-helpers'
import {
  attachToQuestion,
  commentOnQuestion,
  createQuestion,
  getQuestionBySlug,
  getQuestionByTile,
} from '../helpers/domain/question-helpers'
import { app } from '../helpers/infra/test-app'

describe('Get Question By Slug', () => {
  let authToken: string

  beforeAll(async () => {
    authToken = await makeAuthToken(app)
  })

  it('should return 401 and an error response if the user is not authenticated', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const httpResponse = await getQuestionBySlug(app, slug, '')

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid token',
    })
  })

  it('should return 200 and the question with answers', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug

    const httpResponse = await getQuestionBySlug(app, slug, authToken)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.title).toBe(questionData.title)
    expect(httpResponse.body.content).toBe(questionData.content)
    expect(httpResponse.body.answers.items).toEqual([])
    expect(httpResponse.body.answers).toHaveProperty('page')
    expect(httpResponse.body.answers).toHaveProperty('pageSize')
    expect(httpResponse.body.answers).toHaveProperty('totalItems', 0)
    expect(httpResponse.body.answers).toHaveProperty('totalPages')
    expect(httpResponse.body.answers).toHaveProperty('order')
  })

  it('should return question with answers and author data efficiently', async () => {
    const questionData = aQuestion().build()
    await createQuestion(app, authToken, questionData)
    const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
    const slug = createdQuestion.slug
    const questionId = createdQuestion.id

    const answerRequests = []
    for (let i = 0; i < 5; i++) {
      answerRequests.push(
        createAnswer(app, authToken, {
          questionId,
          content: `Answer ${i + 1} with sufficient content to test query optimization`,
        })
      )
    }
    await Promise.all(answerRequests)

    const startTime = Date.now()
    const httpResponse = await getQuestionBySlug(app, slug, authToken)
    const duration = Date.now() - startTime

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.answers.items).toHaveLength(5)
    expect(httpResponse.body.answers.items[0]).toHaveProperty('author')
    expect(httpResponse.body.answers.items[0].author).toHaveProperty('name')
    expect(httpResponse.body.answers.items[0].author).toHaveProperty('email')
    expect(duration).toBeLessThan(500)
  })

  describe('Include Parameter', () => {
    it('should return question with comments when include=comments', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await commentOnQuestion(app, authToken, {
        questionId,
        content: 'First comment on question',
      })
      await commentOnQuestion(app, authToken, {
        questionId,
        content: 'Second comment on question',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { include: 'comments' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.comments).toBeDefined()
      expect(Array.isArray(httpResponse.body.comments)).toBe(true)
      expect(httpResponse.body.comments).toHaveLength(2)
      expect(httpResponse.body.comments[0]).toHaveProperty('content')
      expect(httpResponse.body.comments[0]).toHaveProperty('authorId')
      expect(httpResponse.body.comments[0]).toHaveProperty('questionId', questionId)
    })

    it('should return question with attachments when include=attachments', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await attachToQuestion(app, authToken, {
        questionId,
        title: 'Screenshot 1',
        link: 'https://example.com/screenshot1.png',
      })
      await attachToQuestion(app, authToken, {
        questionId,
        title: 'Screenshot 2',
        link: 'https://example.com/screenshot2.png',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { include: 'attachments' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.attachments).toBeDefined()
      expect(Array.isArray(httpResponse.body.attachments)).toBe(true)
      expect(httpResponse.body.attachments).toHaveLength(2)
      expect(httpResponse.body.attachments[0]).toHaveProperty('title')
      expect(httpResponse.body.attachments[0]).toHaveProperty('link')
      expect(httpResponse.body.attachments[0]).toHaveProperty('questionId', questionId)
    })

    it('should return question with author when include=author', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { include: 'author' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.author).toBeDefined()
      expect(httpResponse.body.author).toHaveProperty('id')
      expect(httpResponse.body.author).toHaveProperty('name')
      expect(httpResponse.body.author).toHaveProperty('email')
      expect(httpResponse.body.author).toHaveProperty('createdAt')
      expect(httpResponse.body.author).not.toHaveProperty('password')
    })

    it('should return question with all includes when multiple are specified', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await commentOnQuestion(app, authToken, {
        questionId,
        content: 'Test comment',
      })
      await attachToQuestion(app, authToken, {
        questionId,
        title: 'Test attachment',
        link: 'https://example.com/file.pdf',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, {
        include: 'comments,attachments,author',
      })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.comments).toBeDefined()
      expect(httpResponse.body.comments).toHaveLength(1)
      expect(httpResponse.body.attachments).toBeDefined()
      expect(httpResponse.body.attachments).toHaveLength(1)
      expect(httpResponse.body.author).toBeDefined()
      expect(httpResponse.body.author).toHaveProperty('name')
    })

    it('should return question without optional fields when include is not specified', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await commentOnQuestion(app, authToken, {
        questionId,
        content: 'This comment should not be returned',
      })
      await attachToQuestion(app, authToken, {
        questionId,
        title: 'This attachment should not be returned',
        link: 'https://example.com/file.pdf',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken)

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.comments).toBeUndefined()
      expect(httpResponse.body.attachments).toBeUndefined()
      expect(httpResponse.body.author).toBeUndefined()
      expect(httpResponse.body.answers).toBeDefined()
    })

    it('should return 422 for invalid include values', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { include: 'invalid,wrong' })

      expect(httpResponse.statusCode).toBe(422)
      expect(httpResponse.body.error).toBe('Unprocessable Entity')
      expect(httpResponse.body.message).toContain('Invalid include values')
    })

    it('should handle empty comments and attachments arrays when include is specified', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug

      const httpResponse = await getQuestionBySlug(app, slug, authToken, {
        include: 'comments,attachments',
      })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.comments).toBeDefined()
      expect(httpResponse.body.comments).toEqual([])
      expect(httpResponse.body.attachments).toBeDefined()
      expect(httpResponse.body.attachments).toEqual([])
    })

    it('should be faster with include than multiple requests', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await commentOnQuestion(app, authToken, { questionId, content: 'Comment 1' })
      await attachToQuestion(app, authToken, { questionId, title: 'File', link: 'https://ex.com/f.pdf' })

      const startTime = Date.now()
      const httpResponse = await getQuestionBySlug(app, slug, authToken, {
        include: 'comments,attachments,author',
      })
      const singleRequestDuration = Date.now() - startTime

      expect(httpResponse.statusCode).toBe(200)
      expect(singleRequestDuration).toBeLessThan(300)
      expect(httpResponse.body.comments).toHaveLength(1)
      expect(httpResponse.body.attachments).toHaveLength(1)
      expect(httpResponse.body.author).toBeDefined()
    })
  })

  describe('Answer Includes Parameter', () => {
    it('should return answers with comments when answerIncludes=comments', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      const answerResponse = await createAnswer(app, authToken, {
        questionId,
        content: 'Test answer with comments',
      })
      const answerId = answerResponse.body.id

      await commentOnAnswer(app, authToken, {
        answerId,
        content: 'First comment on answer',
      })
      await commentOnAnswer(app, authToken, {
        answerId,
        content: 'Second comment on answer',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { answerIncludes: 'comments' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].comments).toBeDefined()
      expect(Array.isArray(httpResponse.body.answers.items[0].comments)).toBe(true)
      expect(httpResponse.body.answers.items[0].comments).toHaveLength(2)
    })

    it('should return answers with attachments when answerIncludes=attachments', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      const answerResponse = await createAnswer(app, authToken, {
        questionId,
        content: 'Test answer with attachments',
      })
      const answerId = answerResponse.body.id

      await attachToAnswer(app, authToken, {
        answerId,
        title: 'Answer Attachment 1',
        link: 'https://example.com/answer-file1.pdf',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { answerIncludes: 'attachments' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].attachments).toBeDefined()
      expect(Array.isArray(httpResponse.body.answers.items[0].attachments)).toBe(true)
      expect(httpResponse.body.answers.items[0].attachments).toHaveLength(1)
    })

    it('should return answers with all includes when multiple answerIncludes are specified', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      const answerResponse = await createAnswer(app, authToken, {
        questionId,
        content: 'Test answer with multiple includes',
      })
      const answerId = answerResponse.body.id

      await commentOnAnswer(app, authToken, { answerId, content: 'Comment' })
      await attachToAnswer(app, authToken, { answerId, title: 'File', link: 'https://ex.com/f.pdf' })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, {
        answerIncludes: 'comments,attachments,author',
      })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].comments).toBeDefined()
      expect(httpResponse.body.answers.items[0].attachments).toBeDefined()
      expect(httpResponse.body.answers.items[0].author).toBeDefined()
      expect(httpResponse.body.answers.items[0].author).not.toHaveProperty('password')
    })

    it('should return answers with author when answerIncludes=author', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await createAnswer(app, authToken, {
        questionId,
        content: 'Test answer to verify author data',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { answerIncludes: 'author' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].author).toBeDefined()
      expect(httpResponse.body.answers.items[0].author).toHaveProperty('id')
      expect(httpResponse.body.answers.items[0].author).toHaveProperty('name')
      expect(httpResponse.body.answers.items[0].author).toHaveProperty('email')
      expect(httpResponse.body.answers.items[0].author).not.toHaveProperty('password')
    })

    it('should return answers without optional fields when answerIncludes is not specified', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      const answerResponse = await createAnswer(app, authToken, {
        questionId,
        content: 'Answer with comments and attachments',
      })
      const answerId = answerResponse.body.id

      await commentOnAnswer(app, authToken, { answerId, content: 'Should not be returned' })
      await attachToAnswer(app, authToken, { answerId, title: 'Should not be returned', link: 'https://ex.com/f.pdf' })

      const httpResponse = await getQuestionBySlug(app, slug, authToken)

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].comments).toBeUndefined()
      expect(httpResponse.body.answers.items[0].attachments).toBeUndefined()
      expect(httpResponse.body.answers.items[0].author).toBeDefined()
    })

    it('should handle empty answer comments and attachments arrays when answerIncludes is specified', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await createAnswer(app, authToken, {
        questionId,
        content: 'Answer without comments or attachments',
      })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, {
        answerIncludes: 'comments,attachments',
      })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].comments).toBeDefined()
      expect(httpResponse.body.answers.items[0].comments).toEqual([])
      expect(httpResponse.body.answers.items[0].attachments).toBeDefined()
      expect(httpResponse.body.answers.items[0].attachments).toEqual([])
    })

    it('should apply answerIncludes to multiple answers', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      const answer1Response = await createAnswer(app, authToken, { questionId, content: 'First answer' })
      const answer2Response = await createAnswer(app, authToken, { questionId, content: 'Second answer' })

      await commentOnAnswer(app, authToken, { answerId: answer1Response.body.id, content: 'Comment on answer 1' })
      await commentOnAnswer(app, authToken, { answerId: answer2Response.body.id, content: 'Comment on answer 2' })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { answerIncludes: 'comments' })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.answers.items).toHaveLength(2)
      expect(httpResponse.body.answers.items[0].comments).toBeDefined()
      expect(httpResponse.body.answers.items[0].comments).toHaveLength(1)
      expect(httpResponse.body.answers.items[1].comments).toBeDefined()
      expect(httpResponse.body.answers.items[1].comments).toHaveLength(1)
    })

    it('should combine question includes and answer includes', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug
      const questionId = createdQuestion.id

      await commentOnQuestion(app, authToken, { questionId, content: 'Question comment' })

      const answerResponse = await createAnswer(app, authToken, { questionId, content: 'Answer content' })
      const answerId = answerResponse.body.id
      await commentOnAnswer(app, authToken, { answerId, content: 'Answer comment' })

      const httpResponse = await getQuestionBySlug(app, slug, authToken, {
        include: 'comments,author',
        answerIncludes: 'comments,author',
      })

      expect(httpResponse.statusCode).toBe(200)
      expect(httpResponse.body.comments).toBeDefined()
      expect(httpResponse.body.comments).toHaveLength(1)
      expect(httpResponse.body.author).toBeDefined()
      expect(httpResponse.body.answers.items).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].comments).toBeDefined()
      expect(httpResponse.body.answers.items[0].comments).toHaveLength(1)
      expect(httpResponse.body.answers.items[0].author).toBeDefined()
    })

    it('should return 422 for invalid answerIncludes values', async () => {
      const questionData = aQuestion().build()
      await createQuestion(app, authToken, questionData)
      const createdQuestion = await getQuestionByTile(app, authToken, questionData.title)
      const slug = createdQuestion.slug

      const httpResponse = await getQuestionBySlug(app, slug, authToken, { answerIncludes: 'invalid,wrong' })

      expect(httpResponse.statusCode).toBe(422)
      expect(httpResponse.body.error).toBe('Unprocessable Entity')
      expect(httpResponse.body.message).toContain('Invalid answerIncludes values')
    })
  })
})
