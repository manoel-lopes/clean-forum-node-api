import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { AnswerComment } from '@/domain/models/answer-comment/answer-comment.model'
import type { Optional } from '@/util/types/optional'

export type CommentOnAnswerRequest = Optional<Omit<AnswerComment, 'id'>, 'createdAt' | 'updatedAt'>

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
    const comment = new AnswerComment(authorId, content, answerId)
    await this.answerCommentsRepository.save(comment)
    return comment
  }
}
