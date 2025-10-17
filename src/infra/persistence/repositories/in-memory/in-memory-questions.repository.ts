import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  PaginatedQuestionsWithIncludes,
  QuestionsRepository,
  UpdateQuestionData
} from '@/domain/application/repositories/questions.repository'
import type { PaginationWithIncludeParams } from '@/domain/application/types/questions-include-params'
import type { Question } from '@/domain/enterprise/entities/question.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async update (questionData: UpdateQuestionData): Promise<Question> {
    const question = await this.updateOne({
      where: { id: questionData.where.id },
      data: questionData.data
    })
    return question
  }

  async findById (questionId: string): Promise<Question | null> {
    return this.findOneBy('id', questionId)
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    return this.findOneBy('title', questionTitle)
  }

  async findBySlug ({
    slug,
    page = 1,
    pageSize = 10,
    order = 'desc'
  }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const question = await this.findOneBy('slug', slug)
    if (!question) {
      return null
    }
    return {
      ...question,
      answers: {
        page,
        pageSize,
        totalItems: 0,
        totalPages: 0,
        items: [],
        order
      },
    }
  }

  async findMany ({
    page = 1,
    pageSize = 20,
    order = 'desc'
  }: PaginationParams): Promise<PaginatedItems<Question>> {
    const questions = await this.findManyItems({ page, pageSize, order })
    return questions
  }

  async findManyWithIncludes ({
    page = 1,
    pageSize = 20,
    order = 'desc'
  }: PaginationWithIncludeParams): Promise<PaginatedQuestionsWithIncludes> {
    const questions = await this.findManyItems({ page, pageSize, order })
    return questions
  }

  async findManyByUserId (
    userId: string,
    { page = 1, pageSize = 10, order = 'desc' }: PaginationParams
  ): Promise<PaginatedItems<Omit<Question, 'answers'>>> {
    const filteredItems = this.items.filter(item => item.authorId === userId)
    const sortedItems = order === 'asc'
      ? filteredItems.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      : filteredItems.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    const totalItems = sortedItems.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const items = sortedItems.slice(startIndex, endIndex)
    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      items,
      order
    }
  }
}
