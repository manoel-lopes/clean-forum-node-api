import type { PaginationParams } from '@/core/application/pagination-params'
import type { UseCase } from '@/core/application/use-case'
import type { PaginatedQuestionComments, QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'

export type FetchQuestionCommentsRequest = {
  questionId: string
} & PaginationParams

export class FetchQuestionCommentsUseCase implements UseCase {
  constructor (private readonly questionCommentsRepository: QuestionCommentsRepository) {}

  async execute (req: FetchQuestionCommentsRequest): Promise<PaginatedQuestionComments> {
    const { questionId, page, pageSize } = req
    return await this.questionCommentsRepository.findManyByQuestionId(questionId, { page, pageSize })
  }
}
