import type { CommentsRepository, UpdateCommentData } from '@/application/repositories/base/comments.repository'
import type { Comment } from '@/domain/entities/base/comment.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryCommentsRepository<T extends Comment = Comment>
  extends BaseRepository<T>
  implements CommentsRepository<T> {
  async update (commentData: UpdateCommentData): Promise<T> {
    const { where, data } = commentData
    const updatedComment = await this.updateOne({ where, data })
    return updatedComment
  }
}
