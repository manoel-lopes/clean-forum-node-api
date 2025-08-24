import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  QuestionsRepository,
  UpdateQuestionData
} from '@/application/repositories/questions.repository'
import { Question } from '@/domain/entities/question/question.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async update (questionData: UpdateQuestionData): Promise<Question> {
    const { where, data } = questionData
    const index = this.items.findIndex((item) => item.id === where.id)
    const item = this.items[index]
    const updatedItem = { ...item, ...data }
    this.items[index] = updatedItem
    return updatedItem
  }

  async findById (questionId: string): Promise<Question | null> {
    return this.findOneBy('id', questionId)
  }

  async findByTitle (title: string): Promise<Question | null> {
    return this.findOneBy('title', title)
  }

  async findBySlug ({ slug, page = 1, pageSize = 10, order = 'desc' }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const question = await this.findOneBy('slug', slug)
    if (!question) {
      return null
    }
    const totalItems = question.answers.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const actualPageSize = Math.min(pageSize, totalItems)
    return {
      id: question.id,
      title: question.title,
      slug: question.slug,
      content: question.content,
      authorId: question.authorId,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      answers: {
        page,
        pageSize: actualPageSize,
        totalItems,
        totalPages,
        order,
        items: question.answers
          .sort((a, b) => {
            if (order === 'asc') {
              return a.createdAt.getTime() - b.createdAt.getTime()
            }
            return b.createdAt.getTime() - a.createdAt.getTime()
          })
          .slice((page - 1) * pageSize, page * pageSize),
      }
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
}
