import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/application/repositories/answer-comments.repository'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import { InMemoryCommentsRepository } from './in-memory-comments.repository'

export class InMemoryAnswerCommentsRepository
  extends InMemoryCommentsRepository<AnswerComment>
  implements AnswerCommentsRepository {
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
