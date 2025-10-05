import { describe, expect, it } from 'vitest'
import { Question } from './question.entity'

describe('Question', () => {
  describe('create', () => {
    it('should be able to recreate a question from existing data with id', () => {
      const existingId = 'existing-question-id'

      const question = Question.create({
        title: 'Existing Question Title',
        content: 'Existing question content',
        authorId: 'author-id',
        bestAnswerId: 'best-answer-id'
      }, existingId)

      expect(question.id).toBe(existingId)
      expect(question.title).toBe('Existing Question Title')
      expect(question.content).toBe('Existing question content')
      expect(question.authorId).toBe('author-id')
      expect(question.bestAnswerId).toBe('best-answer-id')
    })

    it('should automatically generate slug from title in lowercase', () => {
      const question = Question.create({
        title: 'How to Test Clean Architecture?',
        content: 'Question content',
        authorId: 'author-id'
      })

      expect(question.slug).toBe('how-to-test-clean-architecture')
    })

    it('should automatically normalize accented characters when generating slug', () => {
      const question = Question.create({
        title: 'Como Criar uma Aplicação?',
        content: 'Question content',
        authorId: 'author-id'
      })

      expect(question.slug).toBe('como-criar-uma-aplicacao')
    })
  })
})
