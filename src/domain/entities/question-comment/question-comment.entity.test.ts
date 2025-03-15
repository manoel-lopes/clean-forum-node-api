import { QuestionComment } from './question-comment.entity'

describe('QuestionComment', () => {
  it('should create a question comment', () => {
    const questionComment = QuestionComment.create({
      content: 'any_content',
      authorId: 'any_author_id',
      questionId: 'any_question_id'
    })

    expect(questionComment.id).toBeDefined()
    expect(questionComment.content).toBe('any_content')
    expect(questionComment.authorId).toBe('any_author_id')
    expect(questionComment.questionId).toBe('any_question_id')
    expect(questionComment.createdAt).toBeInstanceOf(Date)
    expect(questionComment.updatedAt).toBeInstanceOf(Date)
  })
})
