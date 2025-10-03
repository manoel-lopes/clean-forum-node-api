import type { QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { QuestionCommentProps } from '@/domain/entities/question-comment/ports/question-comment.props'
import { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import type { OmitIdAndTimestamps } from '@/shared/types/custom/omit-id-and-timestamps'

export type CommentOnQuestionRequest = OmitIdAndTimestamps<QuestionCommentProps>

export class CommentOnQuestionUseCase {
  constructor (
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnQuestionRequest): Promise<QuestionComment> {
    const { questionId, content, authorId } = request
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    const comment = QuestionComment.create({ content, authorId, questionId })
    await this.questionCommentsRepository.save(comment)
    return comment
  }
}
