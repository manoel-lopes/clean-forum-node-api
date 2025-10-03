import type { Comment } from '@/domain/models/comment/comment.model'

export type UpdateCommentData = {
  where: { id: string }
  data: Partial<Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>>
}

export type CommentsRepository<T extends Comment = Comment> = {
  findById(commentId: string): Promise<T | null>
  delete(commentId: string): Promise<void>
  update(commentData: UpdateCommentData): Promise<T>
}
