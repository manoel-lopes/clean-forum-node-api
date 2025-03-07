import type {
  AnswersRepository
} from '@/application/repositories/answers.repository'
import type {
  AnswerCommentsRepository
} from '@/application/repositories/answer-comments.repository'
import {
  InMemoryAnswersRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import {
  InMemoryAnswerCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { makeAnswer } from '@/util/factories/domain/make-answer'
import { makeAnswerComment } from '@/util/factories/domain/make-answer-comment'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { ListAnswerCommentsUseCase } from './list-answer-comments.usecase'

describe('ListAnswerCommentsUseCase', () => {
  let sut: ListAnswerCommentsUseCase
  let answerCommentsRepository: AnswerCommentsRepository
  let answersRepository: AnswersRepository

  const request = { answerId: 'any_answer_id', page: 1, pageSize: 10 }

  const saveComments = async (comments: { createdAt: Date }[]) => {
    for (const comment of comments) {
      await answerCommentsRepository.save(makeAnswerComment(request.answerId, comment))
    }
  }

  beforeEach(async () => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ListAnswerCommentsUseCase(answersRepository, answerCommentsRepository)
  })

  it('should not return a list of comments from an inexistent answer', async () => {
    await expect(sut.execute(request))
      .rejects
      .toThrow(new ResourceNotFoundError('Answer'))
  })

  it('should return an empty list of comments when no comments exist', async () => {
    await answersRepository.save(makeAnswer({ id: request.answerId }))

    const response = await sut.execute(request)

    expect(response).toMatchObject({
      items: [],
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 1
    })
  })

  it('should return a list of the most recent comments of a answer', async () => {
    await answersRepository.save(makeAnswer({ id: request.answerId }))
    await saveComments([
      { createdAt: new Date(2025, 0, 18) },
      { createdAt: new Date(2025, 0, 20) },
      { createdAt: new Date(2025, 0, 22) },
    ])

    const response = await sut.execute(request)

    expect(response.items).toHaveLength(3)
    expect(response).toMatchObject({
      items: [
        { createdAt: new Date(2025, 0, 22) },
        { createdAt: new Date(2025, 0, 20) },
        { createdAt: new Date(2025, 0, 18) },
      ],
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1
    })
  })

  it('should return a paginated list of comments for the given answer', async () => {
    await answersRepository.save(makeAnswer({ id: request.answerId }))
    const comments = Array.from({ length: 22 }, (_, i) => ({ createdAt: new Date(2025, 0, 18 + i) }))
    await saveComments(comments)

    let response = await sut.execute({ ...request, page: 1, pageSize: 20 })

    expect(response.items).toHaveLength(20)
    expect(response).toMatchObject({
      items: comments.slice(0, 20).reverse(),
      page: 1,
      pageSize: 20,
      totalItems: 22,
      totalPages: 2
    })

    response = await sut.execute({ ...request, page: 2, pageSize: 20 })

    expect(response.items).toHaveLength(2)
    expect(response).toMatchObject({
      items: comments.slice(20).reverse(),
      page: 2,
      pageSize: 2,
      totalItems: 22,
      totalPages: 2
    })
  })
})
