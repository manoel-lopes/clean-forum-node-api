import { uuidv7 } from 'uuidv7'
import { AnswerComment } from './answer-comment.entity'

describe('AnswerComment', () => {
  it('should create an answer comment', () => {
    const answerComment = AnswerComment.create({
      content: 'This is a comment on an answer',
      authorId: uuidv7(),
      answerId: uuidv7()
    })

    expect(answerComment.content).toBe('This is a comment on an answer')
    expect(answerComment.id).toBeDefined()
    expect(answerComment.createdAt).toBeInstanceOf(Date)
    expect(answerComment.updatedAt).toBeInstanceOf(Date)
  })

  it('should recreate an answer comment from existing data', () => {
    const existingId = uuidv7()
    const authorId = uuidv7()
    const answerId = uuidv7()
    const createdAt = new Date('2024-01-01T10:00:00.000Z')
    const updatedAt = new Date('2024-01-02T15:30:00.000Z')

    const answerComment = AnswerComment.create({
      content: 'This is a comment on an answer',
      authorId,
      answerId,
      createdAt,
      updatedAt
    }, existingId)

    expect(answerComment.id).toBe(existingId)
    expect(answerComment.content).toBe('This is a comment on an answer')
    expect(answerComment.authorId).toBe(authorId)
    expect(answerComment.answerId).toBe(answerId)
    expect(answerComment.createdAt).toBe(createdAt)
    expect(answerComment.updatedAt).toBe(updatedAt)
  })
})
