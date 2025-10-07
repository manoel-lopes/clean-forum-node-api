import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import {
  InMemoryQuestionsRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { UpdateQuestionUseCase } from './update-question.usecase'

describe('UpdateQuestionUseCase', () => {
  let sut: UpdateQuestionUseCase
  let questionsRepository: QuestionsRepository

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new UpdateQuestionUseCase(questionsRepository)
  })

  it('should not update a nonexistent question', async () => {
    await expect(sut.execute({
      questionId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Question'))
  })

  it('should update the question question name', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const response = await sut.execute({
      questionId: question.id,
      content: 'new_content',
    })

    expect(response.id).toBe(question.id)
    expect(response.content).toBe('new_content')
  })

  it('should update the question content', async () => {
    const question = makeQuestion()
    await questionsRepository.create(question)

    const response = await sut.execute({
      questionId: question.id,
      content: 'new_content',
    })

    expect(response.id).toBe(question.id)
    expect(response.content).toBe('new_content')
  })
})
