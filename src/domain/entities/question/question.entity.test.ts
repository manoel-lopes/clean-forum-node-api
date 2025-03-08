import { Question } from './question.entity'

describe('Question', () => {
  it('should create a question', () => {
    const question = Question.create({
      title: 'any_question_title',
      content: 'any_question_content',
      authorId: 'any_author_id',
    })

    expect(question.id).toBeDefined()
    expect(question.content).toBe('any_question_content')
    expect(question.title).toBe('any_question_title')
    expect(question.authorId).toBe('any_author_id')
    expect(question.slug).toBe('any-question-title')
    expect(question.bestAnswerId).toBeUndefined()
    expect(question.createdAt).toBeInstanceOf(Date)
    expect(question.updatedAt).toBeInstanceOf(Date)
  })
})
