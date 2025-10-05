import { uuidv7 } from 'uuidv7'
import { Answer } from './answer.entity'

describe('Answer', () => {
  it('should create an answer', () => {
    const answer = Answer.create({
      content: 'This is an answer',
      questionId: uuidv7(),
      authorId: uuidv7()
    })

    expect(answer.content).toBe('This is an answer')
    expect(answer.id).toBeDefined()
    expect(answer.createdAt).toBeInstanceOf(Date)
    expect(answer.updatedAt).toBeInstanceOf(Date)
  })

  it('should recreate an answer from existing data', () => {
    const existingId = uuidv7()
    const questionId = uuidv7()
    const authorId = uuidv7()
    const createdAt = new Date('2024-01-01T10:00:00.000Z')
    const updatedAt = new Date('2024-01-02T15:30:00.000Z')

    const answer = Answer.create({
      content: 'This is an existing answer',
      questionId,
      authorId,
      createdAt,
      updatedAt
    }, existingId)

    expect(answer.id).toBe(existingId)
    expect(answer.content).toBe('This is an existing answer')
    expect(answer.questionId).toBe(questionId)
    expect(answer.authorId).toBe(authorId)
    expect(answer.createdAt).toBe(createdAt)
    expect(answer.updatedAt).toBe(updatedAt)
  })

  describe('excerpt', () => {
    it('should generate excerpt truncated to 45 characters with ellipsis when content is longer', () => {
      const longContent = 'This is a very long answer content that should be truncated to create an excerpt'

      const answer = Answer.create({
        content: longContent,
        questionId: uuidv7(),
        authorId: uuidv7()
      })

      expect(answer.excerpt).toBe('This is a very long answer content that shoul...')
    })

    it('should remove trailing space from excerpt before adding ellipsis', () => {
      const content = 'This is an answer with exactly forty five '

      const answer = Answer.create({
        content,
        questionId: uuidv7(),
        authorId: uuidv7()
      })

      expect(answer.excerpt).toBe('This is an answer with exactly forty five...')
      expect(answer.excerpt).not.toMatch(/ \.\.\.$/)
    })

    it('should append ellipsis to content shorter than 45 characters', () => {
      const shortContent = 'Short answer'

      const answer = Answer.create({
        content: shortContent,
        questionId: uuidv7(),
        authorId: uuidv7()
      })

      expect(answer.excerpt).toBe('Short answer...')
    })
  })
})
