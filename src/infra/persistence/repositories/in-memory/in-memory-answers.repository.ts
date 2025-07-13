import type { PaginatedItems } from '@/core/application/paginated-items'
import type {
  AnswersRepository,
  FindManyByQuestionIdParams
} from '@/application/repositories/answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async findManyByQuestionId ({ page = 1, pageSize: requestedPageSize = 20, questionId }: FindManyByQuestionIdParams): Promise<PaginatedItems<Answer>> {
    const answers = this.items.filter(answer => answer.questionId === questionId)
    const start = (page - 1) * requestedPageSize
    const end = start + requestedPageSize
    const paginatedAnswers = answers.slice(start, end)
    const totalItems = answers.length
    const totalPages = Math.ceil(totalItems / requestedPageSize)
    const actualPageSize = Math.min(requestedPageSize, totalItems)
    return {
      page,
      pageSize: actualPageSize,
      totalItems,
      totalPages,
      items: paginatedAnswers
    }
  }
}
