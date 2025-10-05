import { describe, expect, it } from 'vitest'
import { Question } from './question.entity'

describe('Question', () => {
  describe('create', () => {
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
