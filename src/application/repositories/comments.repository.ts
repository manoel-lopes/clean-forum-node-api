import type { Comment } from '@/domain/entities/comment/comment.entity'

export type UpdateCommentData = {
  where: { id: string }
  data: Partial<Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>>
}

export interface CommentsRepository<T extends Comment = Comment> {
  findById(commentId: string): Promise<T | null>
  delete(commentId: string): Promise<void>
  update(commentData: UpdateCommentData): Promise<T>
}
