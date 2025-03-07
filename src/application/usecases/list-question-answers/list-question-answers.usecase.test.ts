import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import {
  InMemoryQuestionsRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import {
  InMemoryAnswersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { makeAnswer } from '@/util/factories/domain/make-answer'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { ListQuestionAnswersUseCase } from './list-question-answers.usecase'

describe('ListQuestionAnswersUseCase', () => {
  let sut: ListQuestionAnswersUseCase
  let questionsRepository: QuestionsRepository
  let answersRepository: AnswersRepository

  beforeEach(async () => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ListQuestionAnswersUseCase(questionsRepository, answersRepository)
  })

  const request = { questionId: 'any_question_id', page: 1, pageSize: 10 }

  const saveAnswers = async (answers: Answer[], answersRepository: AnswersRepository) => {
    for (const answer of answers) {
      await answersRepository.save(answer)
    }
  }

  it('should throw ResourceNotFoundError if question does not exist', async () => {
    await expect(sut.execute(request)).rejects.toThrowError(new ResourceNotFoundError('Question'))
  })

  it('should return an empty list if question exists but no answers are available', async () => {
    const question = makeQuestion({ id: request.questionId })
    await questionsRepository.save(question)

    const response = await sut.execute(request)

    expect(response.items).toHaveLength(0)
    expect(response).toMatchObject({
      items: [],
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 1
    })
  })

  it('should return a list of answers for the given question', async () => {
    const question = makeQuestion({ id: request.questionId })
    await questionsRepository.save(question)

    const answers = [
      makeAnswer({ questionId: request.questionId, createdAt: new Date(2025, 0, 18) }),
      makeAnswer({ questionId: request.questionId, createdAt: new Date(2025, 0, 20) }),
    ]
    await saveAnswers(answers, answersRepository)

    const response = await sut.execute(request)

    expect(response.items).toHaveLength(2)
    expect(response).toMatchObject({
      items: answers.slice().reverse(),
      page: 1,
      pageSize: answers.length,
      totalItems: answers.length,
      totalPages: 1
    })
  })

  it('should return paginated answers', async () => {
    const question = makeQuestion({ id: request.questionId })
    await questionsRepository.save(question)

    const answers = Array.from({ length: 22 }, () => makeAnswer({ questionId: request.questionId }))
    await saveAnswers(answers, answersRepository)

    const paginatedRequest = { ...request, page: 2, pageSize: 20 }
    const response = await sut.execute(paginatedRequest)

    expect(response.items).toHaveLength(2)
    expect(response.page).toBe(2)
    expect(response.pageSize).toBe(2)
    expect(response.totalItems).toBe(22)
    expect(response.totalPages).toBe(2)
  })
})
