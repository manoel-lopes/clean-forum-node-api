import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UseCase } from '@/core/domain/application/use-case'
import type {
  AnswerCommentsRepository,
  PaginatedAnswerComments,
} from '@/domain/application/repositories/answer-comments.repository'

type FetchAnswerCommentsRequest = {
  answerId: string
} & PaginationParams

export class FetchAnswerCommentsUseCase implements UseCase {
  constructor(private readonly answerCommentsRepository: AnswerCommentsRepository) {}

  async execute(req: FetchAnswerCommentsRequest): Promise<PaginatedAnswerComments> {
    const { answerId, page, pageSize } = req
    return await this.answerCommentsRepository.findManyByAnswerId(answerId, { page, pageSize })
  }
}
