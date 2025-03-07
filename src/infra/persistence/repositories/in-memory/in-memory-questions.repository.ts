import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  QuestionsRepository,
  UpdateQuestionData,
  PaginatedQuestions,
} from '@/application/repositories/questions.repository'
import { Question } from '@/domain/entities/question/question.entity'
import {
  BaseInMemoryRepository as BaseRepository,
} from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async update (questionData: UpdateQuestionData): Promise<Question> {
    const updatedQuestion = await this.updateOne(questionData)
    return updatedQuestion
  }

  async delete (questionId: string): Promise<void> {
    await this.deleteOneBy('id', questionId)
  }

  async findById (questionId: string): Promise<Question | null> {
    const question = await this.findOneBy('id', questionId)
    return question
  }

  async findBySlug (questionSlug: string): Promise<Question | null> {
    const question = await this.findOneBy('slug', questionSlug)
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await this.findOneBy('title', questionTitle)
    return question
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const { page, pageSize } = params
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize) || 1
    const currentPage = Math.min(Math.max(page, 1), totalPages || 1)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)
    const items = this.items
      .slice(startIndex, endIndex)
      .sort((questionA, questionB) => {
        return questionB.createdAt.getTime() - questionA.createdAt.getTime()
      })

    return {
      items,
      page: currentPage,
      pageSize: items.length,
      totalItems,
      totalPages,
    }
  }
}
