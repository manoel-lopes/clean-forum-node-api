import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
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

    await expect(sut.execute(input)).rejects.toThrow('Answer not found')
  })

  it('should update the answer content', async () => {
    const answer = makeAnswer({ content: 'Original content' })
    await answersRepository.create(answer)

    const input = {
      answerId: answer.id,
      content: 'Updated content',
    }

    const result = await sut.execute(input)

    expect(result.id).toBe(answer.id)
    expect(result.content).toBe('Updated content')
  })
})
