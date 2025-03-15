import { AnswerComment } from './answer-comment.entity'

describe('AnswerComment', () => {
  it('should create a answer comment', () => {
    const answerComment = AnswerComment.create({
      content: 'any_content',
      authorId: 'any_author_id',
      answerId: 'any_answer_id'
    })

    expect(answerComment.id).toBeDefined()
    expect(answerComment.content).toBe('any_content')
    expect(answerComment.authorId).toBe('any_author_id')
    expect(answerComment.answerId).toBe('any_answer_id')
    expect(answerComment.createdAt).toBeInstanceOf(Date)
    expect(answerComment.updatedAt).toBeInstanceOf(Date)
  })
})
