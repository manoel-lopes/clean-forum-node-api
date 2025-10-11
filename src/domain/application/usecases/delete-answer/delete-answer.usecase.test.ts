import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { createAndSave, expectEntityToBeDeleted } from '@/shared/util/test/test-helpers'
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
      authorId: 'any_author_id'
    })).rejects.toThrowError(new ResourceNotFoundError('Answer'))
  })

  it('should not delete an answer if the user is not the author', async () => {
    const answer = await createAndSave(makeAnswer, answersRepository)

    await expect(sut.execute({
      answerId: answer.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrowError(new NotAuthorError('answer'))
  })

  it('should delete an answer', async () => {
    const answer = await createAndSave(makeAnswer, answersRepository)

    await sut.execute({ answerId: answer.id, authorId: answer.authorId })

    await expectEntityToBeDeleted(answersRepository, answer.id)
  })
})
