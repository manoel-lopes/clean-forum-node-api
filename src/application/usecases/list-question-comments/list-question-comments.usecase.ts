import type { UseCase } from '@/core/application/use-case'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type {
  QuestionCommentsRepository,
  PaginatedQuestionComments
} from '@/application/repositories/question-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type ListQuestionCommentsRequest = PaginationParams & {
  questionId: string
}

export class ListQuestionCommentsUseCase implements UseCase {
  constructor (
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: ListQuestionCommentsRequest): Promise<PaginatedQuestionComments> {
    const { questionId, page, pageSize } = req
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    const comments = await this.questionCommentsRepository.findManyByQuestionId(question.id, {
      page,
      pageSize
    })
    return comments
  }
}
