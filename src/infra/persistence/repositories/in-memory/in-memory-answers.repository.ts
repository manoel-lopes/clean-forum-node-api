import type {
  AnswersRepository,
  FindManyByQuestionIdParams,
  PaginatedAnswersWithIncludes,
  UpdateAnswerData,
} from '@/domain/application/repositories/answers.repository'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async update (answerData: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await this.updateOne(answerData)
    return updatedAnswer
  }

  async findManyByQuestionId ({
    questionId,
    page = 1,
    pageSize = 20,
    order = 'desc',
  }: FindManyByQuestionIdParams): Promise<PaginatedAnswersWithIncludes> {
    const answers = this.items.filter((answer) => answer.questionId === questionId)
    const sortedAnswers = answers.sort((a, b) => {
      if (order === 'desc') {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedAnswers = sortedAnswers.slice(start, end)
    return {
      page,
      pageSize,
      totalItems: answers.length,
      totalPages: Math.ceil(answers.length / pageSize),
      order,
      items: paginatedAnswers,
    }
  }
}
