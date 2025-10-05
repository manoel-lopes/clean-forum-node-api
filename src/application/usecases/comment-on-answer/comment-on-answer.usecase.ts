import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import { AnswerComment, type AnswerCommentProps } from '@/domain/entities/answer-comment/answer-comment.entity'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type { OmitTimestamps } from '@/shared/types/custom/omit-timestamps'

type CommentOnAnswerRequest = OmitTimestamps<AnswerCommentProps>

export class CommentOnAnswerUseCase {
  constructor (
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnAnswerRequest): Promise<AnswerComment> {
    const { answerId, content, authorId } = request
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }
    const comment = AnswerComment.create({ content, authorId, answerId })
    await this.answerCommentsRepository.save(comment)
    return comment
  }
}
