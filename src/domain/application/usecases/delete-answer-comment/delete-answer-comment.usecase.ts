import type { UseCase } from '@/core/domain/application/use-case'
import type { AnswerCommentsRepository } from '@/domain/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type DeleteAnswerCommentRequest = {
  commentId: string
  authorId: string
}

export class DeleteAnswerCommentUseCase implements UseCase {
  constructor (
    private readonly answerCommentsRepo: AnswerCommentsRepository,
    private readonly answersRepo: AnswersRepository
  ) {}

  async execute (req: DeleteAnswerCommentRequest) {
    const { commentId, authorId } = req
    const comment = await this.answerCommentsRepo.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Comment')
    }
    const answer = await this.answersRepo.findById(comment.answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }
    const isCommentAuthor = comment.authorId === authorId
    const isAnswerAuthor = answer.authorId === authorId
    if (!isCommentAuthor && !isAnswerAuthor) {
      throw new NotAuthorError('comment')
    }
    await this.answerCommentsRepo.delete(commentId)
  }
}
