import type { UseCase } from '@/core/application/use-case'
import type { CommentsRepository } from '@/application/repositories/comments.repository'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type DeleteCommentRequest = {
  commentId: string
  authorId: string
}

export class DeleteCommentUseCase implements UseCase {
  constructor (
    private readonly commentRepository: CommentsRepository
  ) {}

  async execute (req: DeleteCommentRequest): Promise<void> {
    const { commentId, authorId } = req
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Comment')
    }
    if (comment.authorId !== authorId) {
      throw new NotAuthorError('comment')
    }
    await this.commentRepository.delete(commentId)
  }
}
