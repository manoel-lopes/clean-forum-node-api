import { uuidv7 } from 'uuidv7'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/domain/application/repositories/answer-comments.repository'
import type { AnswerComment, AnswerCommentProps } from '@/domain/enterprise/entities/answer-comment.entity'
import { InMemoryCommentsRepository } from './in-memory-comments.repository'

export class InMemoryAnswerCommentsRepository
  extends InMemoryCommentsRepository<AnswerComment>
  implements AnswerCommentsRepository {
  async save (data: AnswerCommentProps): Promise<void> {
    const comment: AnswerComment = {
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: data.authorId,
      content: data.content,
      answerId: data.answerId
    }
    this.items.push(comment)
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
