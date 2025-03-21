import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import type {
  QuestionCommentProps
} from '@/domain/entities/question-comment/ports/question-comment.props'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type CommentOnQuestionRequest = QuestionCommentProps

export class CommentOnQuestionUseCase {
  constructor (
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnQuestionRequest): Promise<void> {
    const { questionId, content, authorId } = request
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    const comment = QuestionComment.create({ content, authorId, questionId })
    await this.questionCommentsRepository.save({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      questionId: comment.questionId
    })
  }
}
