import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'

import type {
  QuestionsRepository,
  UpdateQuestionData
} from '@/application/repositories/questions.repository'

import { Question } from '@/domain/entities/question/question.entity'

import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await this.findOneBy('title', questionTitle)
    return question
  }

  async findBySlug (slug: string): Promise<Question | null> {
    const question = await this.findOneBy('slug', slug)
    return question
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    return this.updateOne(questionData)
  }

  async findMany ({ page = 1, pageSize = 20 }: PaginationParams): Promise<PaginatedItems<Question>> {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const questions = this.items.slice(start, end)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize)

    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      items: questions
    }
  }
}
