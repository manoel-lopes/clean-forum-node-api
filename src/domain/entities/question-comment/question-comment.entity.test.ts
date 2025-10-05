import { uuidv7 } from 'uuidv7'
import { QuestionComment } from './question-comment.entity'

describe('QuestionComment', () => {
  it('should create a question comment', () => {
    const questionComment = QuestionComment.create({
      content: 'This is a comment on a question',
      authorId: uuidv7(),
      questionId: uuidv7()
    })

    expect(questionComment.content).toBe('This is a comment on a question')
    expect(questionComment.id).toBeDefined()
    expect(questionComment.createdAt).toBeInstanceOf(Date)
    expect(questionComment.updatedAt).toBeInstanceOf(Date)
  })

  it('should recreate a question comment from existing data', () => {
    const existingId = uuidv7()
    const authorId = uuidv7()
    const questionId = uuidv7()
    const createdAt = new Date('2024-01-01T10:00:00.000Z')
    const updatedAt = new Date('2024-01-02T15:30:00.000Z')

    const questionComment = QuestionComment.create({
      content: 'This is a comment on a question',
      authorId,
      questionId,
      createdAt,
      updatedAt
    }, existingId)

    expect(questionComment.id).toBe(existingId)
    expect(questionComment.content).toBe('This is a comment on a question')
    expect(questionComment.authorId).toBe(authorId)
    expect(questionComment.questionId).toBe(questionId)
    expect(questionComment.createdAt).toBe(createdAt)
    expect(questionComment.updatedAt).toBe(updatedAt)
  })
})
