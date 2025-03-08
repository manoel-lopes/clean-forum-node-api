import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  AnswerCommentsRepository,
  UpdateAnswerCommentData,
  PaginatedAnswerComments,
} from '@/application/repositories/answer-comments.repository'
import type { AnswerComment } from '@/domain/models/answer-comment/answer-comment.model'
import {
  BaseInMemoryRepository as BaseRepository,
} from './base/base-in-memory.repository'

export class InMemoryAnswerCommentsRepository extends BaseRepository<AnswerComment>
  implements AnswerCommentsRepository {
  async update (commentData: UpdateAnswerCommentData): Promise<AnswerComment> {
    const updatedComment = await this.updateOne(commentData)
    return updatedComment
  }

  async delete (commentId: string): Promise<void> {
    await this.deleteOneBy('id', commentId)
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const comment = await this.findOneBy('id', commentId)
    return comment
  }

  async findManyByAnswerId (
    answerId: string,
    params: PaginationParams
  ): Promise<PaginatedAnswerComments> {
    const { page, pageSize } = params
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize) || 1
    const currentPage = Math.min(Math.max(page, 1), totalPages || 1)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)
    const items = this.items
      .filter((answer) => answer.answerId === answerId)
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
