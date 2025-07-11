import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'

import type { AnswersRepository } from '@/application/repositories/answers.repository'

import type { Answer } from '@/domain/entities/answer/answer.entity'

import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async findMany ({ page = 1, pageSize = 20 }: PaginationParams): Promise<PaginatedItems<Answer>> {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const answers = this.items.slice(start, end)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      items: answers
    }
  }
}
