import { makeAnswer } from '@test/util/factories/domain/make-answer'
import { InMemoryAnswersRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { DeleteAnswerUseCase } from './delete-answer.usecase'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'
import { NotAuthorError } from '@application/errors/not-author.error'

describe('DeleteAnswerUseCase', () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: DeleteAnswerUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepository)
  })

  it('should be able to delete an answer', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id,
      authorId: answer.authorId,
    })

    expect(answersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existing answer', async () => {
    await expect(sut.execute({
      answerId: 'non-existing-id',
      authorId: 'author-1',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete an answer from another author', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    await expect(sut.execute({
      answerId: answer.id,
      authorId: 'another-author',
    })).rejects.toBeInstanceOf(NotAuthorError)
  })
})
