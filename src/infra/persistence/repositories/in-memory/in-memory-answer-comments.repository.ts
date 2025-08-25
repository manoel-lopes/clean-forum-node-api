import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/application/repositories/base/base-comments.repository'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswerCommentsRepository
  extends BaseRepository<AnswerComment>
  implements AnswerCommentsRepository {
  async update (commentData: UpdateCommentData): Promise<AnswerComment> {
    const { where, data } = commentData
    const updatedComment = await this.updateOne({ where, data })
    return updatedComment
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const comments = await this.findManyItemsBy({
      where: { answerId },
      params: {
        page: params.page,
        pageSize: params.pageSize,
        order: params.order
      }
    })
    return comments
  }
}
