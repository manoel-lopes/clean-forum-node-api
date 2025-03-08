import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  QuestionCommentsRepository,
  UpdateQuestionCommentData,
  PaginatedQuestionComments,
} from '@/application/repositories/question-comments.repository'
import type { QuestionComment } from '@/infra/persistence/typeorm/data-mappers/question-comment/question-comment.mapper'
import {
  BaseInMemoryRepository as BaseRepository,
} from './base/base-in-memory.repository'

export class InMemoryQuestionCommentsRepository extends BaseRepository<QuestionComment>
  implements QuestionCommentsRepository {
  async update (commentData: UpdateQuestionCommentData): Promise<QuestionComment> {
    const updatedComment = await this.updateOne(commentData)
    return updatedComment
  }

  async delete (commentId: string): Promise<void> {
    await this.deleteOneBy('id', commentId)
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const comment = await this.findOneBy('id', commentId)
    return comment
  }

  async findManyByQuestionId (
    questionId: string,
    params: PaginationParams
  ): Promise<PaginatedQuestionComments> {
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
