import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import {
  InMemoryAnswersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
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
    await expect(sut.execute({
      answerId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Answer'))
  })

  it('should update the answer account name', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const response = await sut.execute({
      answerId: answer.id,
      content: 'new_content',
    })

    expect(response.id).toBe(answer.id)
    expect(response.content).toBe('new_content')
  })

  it('should update the answer content', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const response = await sut.execute({
      answerId: answer.id,
      content: 'new_content',
    })

    expect(response.id).toBe(answer.id)
    expect(response.content).toBe('new_content')
  })
})
