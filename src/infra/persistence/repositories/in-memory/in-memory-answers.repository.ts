import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  AnswersRepository,
  UpdateAnswerData,
  PaginatedAnswers
} from '@/application/repositories/answers.repository'
import type { Answer } from '@/infra/persistence/typeorm/data-mappers/answer/answer.mapper'
import {
  BaseInMemoryRepository as BaseRepository,
} from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async update (answerData: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await this.updateOne(answerData)
    return updatedAnswer
  }

  async delete (answerId: string): Promise<void> {
    await this.deleteOneBy('id', answerId)
  }

  async findById (answerId: string): Promise<Answer | null> {
    const answer = await this.findOneBy('id', answerId)
    return answer
  }

  async findManyByQuestionId (
    questionId: string,
    params: PaginationParams
  ): Promise<PaginatedAnswers> {
    const { page, pageSize } = params
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize) || 1
    const currentPage = Math.min(Math.max(page, 1), totalPages || 1)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)
    const items = this.items
      .filter((answer) => answer.questionId === questionId)
      .slice(startIndex, endIndex)
      .sort((answerA, answerB) => {
        return answerB.createdAt.getTime() - answerA.createdAt.getTime()
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
