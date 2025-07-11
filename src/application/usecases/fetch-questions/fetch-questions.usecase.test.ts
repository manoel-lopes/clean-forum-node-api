import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import { makeQuestion } from '@/util/factories/domain/make-question'

import { FetchQuestionsUseCase } from './fetch-questions.usecase'

describe('FetchQuestionsUseCase', () => {
  let questionsRepository: InMemoryQuestionsRepository
  let sut: FetchQuestionsUseCase

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionsUseCase(questionsRepository)
  })

  it('should be able to fetch a list of questions', async () => {
    await questionsRepository.save(makeQuestion())
    await questionsRepository.save(makeQuestion())
    await questionsRepository.save(makeQuestion())

    const result = await sut.execute({ page: 1, pageSize: 10 })

    expect(result.items).toHaveLength(3)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
  })

  it('should be able to fetch a paginated list of questions', async () => {
    for (let i = 1; i <= 20; i++) {
      await questionsRepository.save(makeQuestion())
    }

    const result = await sut.execute({ page: 2, pageSize: 10 })

    expect(result.items).toHaveLength(10)
    expect(result.totalItems).toBe(20)
    expect(result.totalPages).toBe(2)
    expect(result.page).toBe(2)
    expect(result.pageSize).toBe(10)
  })
})
