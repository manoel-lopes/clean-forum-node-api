import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { makeQuestion } from '@/util/factories/domain/make-question'

import { DeleteQuestionUseCase } from './delete-question.usecase'

describe('DeleteQuestionUseCase', () => {
  let sut: DeleteQuestionUseCase
  let questionsRepository: QuestionsRepository

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(questionsRepository)
  })

  it('should not delete a nonexistent question', async () => {
    await expect(sut.execute({
      questionId: 'any_inexistent_id',
      authorId: 'any_author_id'
    })).rejects.toThrowError(new ResourceNotFoundError('Question'))
  })

  it('should not delete a question if the user is not the author', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    await expect(sut.execute({
      questionId: question.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrowError(new NotAuthorError('question'))
  })

  it('should delete a question', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    const currentQuestion = await questionsRepository.findById(question.id)
    expect(currentQuestion?.id).toBe(question.id)
    expect(currentQuestion?.content).toBe(question.content)
    expect(currentQuestion?.title).toBe(question.title)
    expect(currentQuestion?.authorId).toBe(question.authorId)
    expect(currentQuestion?.bestAnswerId).toBe(question.bestAnswerId)
    expect(currentQuestion?.createdAt).toBeInstanceOf(Date)
    expect(currentQuestion?.updatedAt).toBeInstanceOf(Date)

    await sut.execute({ questionId: question.id, authorId: question.authorId })

    const deletedQuestion = await questionsRepository.findById(question.id)
    expect(deletedQuestion).toBeNull()
  })
})
