import type { UseCase } from '@/core/application/use-case'
import type { CommentsRepository } from '@/application/repositories/comments.repository'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { Comment } from '@/domain/entities/comment/comment.entity'

export type EditCommentRequest = {
  commentId: string
  authorId: string
  content: string
}

export class EditCommentUseCase implements UseCase {
  constructor (
    private readonly commentRepository: CommentsRepository
  ) {}

  async execute (req: EditCommentRequest): Promise<Comment> {
    const { commentId, authorId, content } = req
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Comment')
    }
    if (comment.authorId !== authorId) {
      throw new NotAuthorError('comment')
    }
    return await this.commentRepository.update({
      where: { id: commentId },
      data: { content }
    })
  }
}
