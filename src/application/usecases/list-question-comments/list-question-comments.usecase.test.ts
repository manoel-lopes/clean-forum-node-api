import type {
  QuestionsRepository
} from '@/application/repositories/questions.repository'
import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import {
  InMemoryQuestionsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import {
  InMemoryQuestionCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { makeQuestionComment } from '@/util/factories/domain/make-question-comment'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { ListQuestionCommentsUseCase } from './list-question-comments.usecase'

describe('ListQuestionCommentsUseCase', () => {
  let sut: ListQuestionCommentsUseCase
  let questionCommentsRepository: QuestionCommentsRepository
  let questionsRepository: QuestionsRepository

  const request = { questionId: 'any_question_id', page: 1, pageSize: 10 }

  const saveComments = async (comments: { createdAt: Date }[]) => {
    for (const comment of comments) {
      await questionCommentsRepository.save(makeQuestionComment(request.questionId, comment))
    }
  }

  beforeEach(async () => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new ListQuestionCommentsUseCase(questionsRepository, questionCommentsRepository)
  })

  it('should not return a list of comments from an inexistent question', async () => {
    await expect(sut.execute(request))
      .rejects
      .toThrow(new ResourceNotFoundError('Question'))
  })

  it('should return an empty list of comments when no comments exist', async () => {
    await questionsRepository.save(makeQuestion({ id: request.questionId }))

    const response = await sut.execute(request)

    expect(response).toMatchObject({
      items: [],
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 1
    })
  })

  it('should return a list of the most recent comments of a question', async () => {
    await questionsRepository.save(makeQuestion({ id: request.questionId }))
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

  it('should return a paginated list of comments for the given question', async () => {
    await questionsRepository.save(makeQuestion({ id: request.questionId }))
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
