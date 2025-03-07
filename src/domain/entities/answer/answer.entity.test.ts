import { Answer } from './answer.entity'

describe('Answer', () => {
  it('should create a answer', () => {
    const answer = Answer.create({
      content: 'any_question_content',
      authorId: 'any_author_id',
      questionId: 'any_question_id',
    })

    expect(answer.id).toBeDefined()
    expect(answer.content).toBe('any_question_content')
    expect(answer.authorId).toBe('any_author_id')
    expect(answer.questionId).toBe('any_question_id')
    expect(answer.excerpt).toBe('any_question_content...')
    expect(answer.createdAt).toBeInstanceOf(Date)
    expect(answer.updatedAt).toBeInstanceOf(Date)
  })
})
