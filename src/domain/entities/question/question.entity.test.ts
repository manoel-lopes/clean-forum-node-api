import { uuidv7 } from 'uuidv7'
import { Question } from './question.entity'

describe('Question', () => {
  it('should create a question', () => {
    const question = Question.create({
      title: 'How to use TypeScript?',
      content: 'I need help with TypeScript',
      authorId: uuidv7()
    })

    expect(question.title).toBe('How to use TypeScript?')
    expect(question.content).toBe('I need help with TypeScript')
    expect(question.slug).toBe('how-to-use-typescript')
    expect(question.id).toBeDefined()
    expect(question.createdAt).toBeInstanceOf(Date)
    expect(question.updatedAt).toBeInstanceOf(Date)
  })

  it('should recreate a question from existing data', () => {
    const existingId = uuidv7()
    const authorId = uuidv7()
    const bestAnswerId = uuidv7()
    const createdAt = new Date('2024-01-01T10:00:00.000Z')
    const updatedAt = new Date('2024-01-02T15:30:00.000Z')

    const question = Question.create({
      title: 'Existing Question Title',
      content: 'Existing question content',
      authorId,
      bestAnswerId,
      createdAt,
      updatedAt
    }, existingId)

    expect(question.id).toBe(existingId)
    expect(question.title).toBe('Existing Question Title')
    expect(question.content).toBe('Existing question content')
    expect(question.authorId).toBe(authorId)
    expect(question.bestAnswerId).toBe(bestAnswerId)
    expect(question.createdAt).toBe(createdAt)
    expect(question.updatedAt).toBe(updatedAt)
  })

  describe('slug generation', () => {
    it('should automatically generate slug from title in lowercase', () => {
      const question = Question.create({
        title: 'How to Test Clean Architecture?',
        content: 'Question content',
        authorId: uuidv7()
      })

      expect(question.slug).toBe('how-to-test-clean-architecture')
    })

    it('should automatically normalize accented characters when generating slug', () => {
      const question = Question.create({
        title: 'Como Criar uma Aplicação?',
        content: 'Question content',
        authorId: uuidv7()
      })

      expect(question.slug).toBe('como-criar-uma-aplicacao')
    })
  })
})
