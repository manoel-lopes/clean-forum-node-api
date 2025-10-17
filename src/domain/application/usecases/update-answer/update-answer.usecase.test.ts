import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { createAndSave, expectEntityToMatch, expectToThrowResourceNotFound } from '@/shared/util/test/test-helpers'
import { UpdateAccountUseCase } from './update-answer.usecase'

describe('UpdateAccountUseCase', () => {
  let sut: UpdateAccountUseCase
  let answersRepository: AnswersRepository

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new UpdateAccountUseCase(answersRepository)
  })

  it('should not update a nonexistent answer', async () => {
    const input = {
      answerId: 'nonexistent-answer-id',
    }

    await expectToThrowResourceNotFound(async () => sut.execute(input), 'Answer')
  })

  it('should update the answer content', async () => {
    const answer = await createAndSave(makeAnswer, answersRepository, { content: 'Original content' })

    const input = {
      answerId: answer.id,
      content: 'Updated content',
    }

    const result = await sut.execute(input)

    expectEntityToMatch(result, {
      id: answer.id,
      content: 'Updated content',
    })
  })
})
