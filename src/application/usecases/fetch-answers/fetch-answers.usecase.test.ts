import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'

import { makeAnswer } from '@/util/factories/domain/make-answer'

import { FetchAnswersUseCase } from './fetch-answers.usecase'

describe('FetchAnswersUseCase', () => {
  let answersRepository: InMemoryAnswersRepository
  let sut: FetchAnswersUseCase

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchAnswersUseCase(answersRepository)
  })

  it('should be able to fetch a list of answers', async () => {
    await answersRepository.save(makeAnswer())
    await answersRepository.save(makeAnswer())
    await answersRepository.save(makeAnswer())

    const result = await sut.execute({ page: 1, pageSize: 10 })

    expect(result.items).toHaveLength(3)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
  })

  it('should be able to fetch a paginated list of answers', async () => {
    for (let i = 1; i <= 20; i++) {
      await answersRepository.save(makeAnswer())
    }

    const result = await sut.execute({ page: 2, pageSize: 10 })

    expect(result.items).toHaveLength(10)
    expect(result.totalItems).toBe(20)
    expect(result.totalPages).toBe(2)
    expect(result.page).toBe(2)
    expect(result.pageSize).toBe(10)
  })
})
