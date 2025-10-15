import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UseCase } from '@/core/domain/application/use-case'
import type { PaginatedQuestionAttachments, QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments.repository'

type FetchQuestionAttachmentsRequest = {
  questionId: string
} & PaginationParams

export class FetchQuestionAttachmentsUseCase implements UseCase {
  constructor (private readonly questionAttachmentsRepository: QuestionAttachmentsRepository) {}

  async execute (req: FetchQuestionAttachmentsRequest): Promise<PaginatedQuestionAttachments> {
    const { questionId, page, pageSize, order } = req
    return await this.questionAttachmentsRepository.findManyByQuestionId(questionId, { page, pageSize, order })
  }
}
