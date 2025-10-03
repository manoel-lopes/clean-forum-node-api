import type { CommentsRepository, UpdateCommentData } from '@/application/repositories/comments.repository'
import type { Comment } from '@/domain/models/comment/comment.model'
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
