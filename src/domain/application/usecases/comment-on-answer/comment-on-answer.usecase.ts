import type { AnswerCommentsRepository } from '@/domain/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import type { AnswerComment, AnswerCommentProps } from '@/domain/enterprise/entities/answer-comment.entity'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type CommentOnAnswerRequest = AnswerCommentProps

export class CommentOnAnswerUseCase {
  constructor (
    private answersRepo: AnswersRepository,
    private answerCommentsRepo: AnswerCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnAnswerRequest): Promise<AnswerComment> {
    const { answerId, content, authorId } = request
    const answer = await this.answersRepo.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }
    const comment = await this.answerCommentsRepo.create({ content, authorId, answerId })
    return comment
  }
}
