import { makeAnswerData } from 'tests/factories/domain/make-answer'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { DeleteAnswerUseCase } from './delete-answer.usecase'

describe('DeleteAnswerUseCase', () => {
  let sut: DeleteAnswerUseCase
  let answersRepo: AnswersRepository

  beforeEach(() => {
    answersRepo = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(answersRepo)
  })

  it('should not delete a nonexistent answer', async () => {
    await expect(
      sut.execute({
        answerId: 'any_inexistent_id',
        authorId: 'any_author_id',
      })
    ).rejects.toThrow('Answer not found')
  })

  it('should not delete an answer if the user is not the author', async () => {
    const answer = await answersRepo.create(makeAnswerData())

    await expect(
      sut.execute({
        answerId: answer.id,
        authorId: 'wrong_author_id',
      })
    ).rejects.toThrow('The user is not the author of the answer')
  })

  it('should delete an answer', async () => {
    const answer = await answersRepo.create(makeAnswerData())

    await sut.execute({ answerId: answer.id, authorId: answer.authorId })

    const deletedAnswer = await answersRepo.findById(answer.id)
    expect(deletedAnswer).toBeNull()
  })
})
