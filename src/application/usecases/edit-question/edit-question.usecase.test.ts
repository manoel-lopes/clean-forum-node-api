import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import {
  InMemoryQuestionsRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { EditQuestionUseCase } from './edit-question.usecase'

describe('EditQuestionUseCase', () => {
  let sut: EditQuestionUseCase
  let questionsRepository: QuestionsRepository

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should not edit a nonexistent question', async () => {
    await expect(sut.execute({
      questionId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Question'))
  })

  it('should edit the question title', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    const response = await sut.execute({
      questionId: question.id,
      title: 'new_title',
    })

    expect(response.id).toBe(question.id)
    expect(response.title).toBe('new_title')
    expect(response.content).toBe(question.content)
    expect(response.authorId).toBe(question.authorId)
    expect(response.slug).toBe(question.slug)
    expect(response.updatedAt).toBeInstanceOf(Date)
    expect(response.createdAt).toBeInstanceOf(Date)
  })

  it('should edit the question content', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    const response = await sut.execute({
      questionId: question.id,
      content: 'new_content',
    })

    expect(response.id).toBe(question.id)
    expect(response.content).toBe('new_content')
    expect(response.title).toBe(question.title)
    expect(response.authorId).toBe(question.authorId)
    expect(response.slug).toBe(question.slug)
    expect(response.createdAt).toBeInstanceOf(Date)
    expect(response.updatedAt).toBeInstanceOf(Date)
  })
})
