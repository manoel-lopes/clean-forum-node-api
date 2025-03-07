import type { AnswersRepository } from '@/application/repositories/answers.repository'
import {
  InMemoryAnswersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { makeAnswer } from '@/util/factories/domain/make-answer'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { EditAnswerUseCase } from './edit-answer.usecase'

describe('EditAnswerUseCase', () => {
  let sut: EditAnswerUseCase
  let answersRepository: AnswersRepository

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should not edit a nonexistent answer', async () => {
    await expect(sut.execute({
      answerId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Answer'))
  })

  it('should edit the answer content', async () => {
    const answer = makeAnswer()
    await answersRepository.save(answer)

    const response = await sut.execute({
      answerId: answer.id,
      content: 'new_content',
    })

    expect(response.id).toBe(answer.id)
    expect(response.content).toBe('new_content')
    expect(response.authorId).toBe(answer.authorId)
    expect(response.createdAt).toBeInstanceOf(Date)
    expect(response.updatedAt).toBeInstanceOf(Date)
  })
})
