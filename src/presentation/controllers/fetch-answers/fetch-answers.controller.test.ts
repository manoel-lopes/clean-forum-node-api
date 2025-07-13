import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'

import type { AnswersRepository } from '@/application/repositories/answers.repository'

import type { Answer } from '@/domain/entities/answer/answer.entity'

import { makeAnswer } from '@/util/factories/domain/make-answer'

import { FetchAnswersController } from './fetch-answers.controller'

const makeHttpRequest = (page?: number, pageSize?: number) => ({
  query: { page, pageSize }
})

const makeAnswers = async (count: number, saveAnswerFn: (answer: Answer) => Promise<void>) => {
  const answers = Array.from({ length: count }, () => makeAnswer())
  for (const answer of answers) {
    await saveAnswerFn(answer)
  }
  return answers
}

describe('FetchAnswersController', () => {
  let answersRepository: AnswersRepository
  let sut: FetchAnswersController

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new FetchAnswersController(answersRepository)
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(answersRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no answers are found', async () => {
    const httpResponse = await sut.handle(makeHttpRequest(1, 10))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
      items: []
    })
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const answer = makeAnswer()
    await answersRepository.save(answer)

    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 1,
      totalItems: 1,
      totalPages: 1,
      items: [expect.objectContaining({
        id: answer.id,
        content: answer.content,
        authorId: answer.authorId,
        questionId: answer.questionId,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt
      })]
    })
  })

  it('should return 200 with correct pagination', async () => {
    const answers = await makeAnswers(5, answer => answersRepository.save(answer))
    const httpResponse = await sut.handle(makeHttpRequest(1, 2))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
      items: answers.slice(0, 2).map(answer => expect.objectContaining({
        id: answer.id,
        content: answer.content,
        authorId: answer.authorId,
        questionId: answer.questionId,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt
      }))
    })
  })
})
