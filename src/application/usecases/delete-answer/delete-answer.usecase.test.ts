import type { AnswersRepository } from '@/application/repositories/answers.repository'
import {
  InMemoryAnswersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { makeAnswer } from '@/util/factories/domain/make-answer'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { DeleteAnswerUseCase } from './delete-answer.usecase'

describe('DeleteAnswerUseCase', () => {
  let sut: DeleteAnswerUseCase
  let answersRepository: AnswersRepository

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should not delete a nonexistent answer', async () => {
    await expect(sut.execute({
      answerId: 'any_inexistent_id',
      authorId: 'any_author_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Answer'))
  })

  it('should not delete an answer if the user is not the author', async () => {
    const answer = makeAnswer()
    await answersRepository.save(answer)

    await expect(sut.execute({
      answerId: answer.id,
      authorId: 'wrong_author_id',
    })).rejects.toThrowError(new NotAuthorError('answer'))
  })

  it('should delete an answer', async () => {
    const answer = makeAnswer()
    await answersRepository.save(answer)

    const currentAnswer = await answersRepository.findById(answer.id)
    expect(currentAnswer?.id).toBe(answer.id)
    expect(currentAnswer?.content).toBe(answer.content)
    expect(currentAnswer?.authorId).toBe(answer.authorId)
    expect(currentAnswer?.createdAt).toBeInstanceOf(Date)
    expect(currentAnswer?.updatedAt).toBeInstanceOf(Date)

    await sut.execute({ answerId: answer.id, authorId: answer.authorId })

    const deletedAnswer = await answersRepository.findById(answer.id)
    expect(deletedAnswer).toBeNull()
  })
})
