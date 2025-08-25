import type { Comment } from '@prisma/client'

export type UpdateCommentData = {
  where: { id: string }
  data: Partial<Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>>
}

export type BaseCommentsRepository = {
  delete(commentId: string): Promise<void>
}
