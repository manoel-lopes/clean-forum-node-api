import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UseCase } from '@/core/domain/application/use-case'
import type { AnswerAttachmentsRepository, PaginatedAnswerAttachments } from '@/domain/application/repositories/answer-attachments.repository'

type FetchAnswerAttachmentsRequest = {
  answerId: string
} & PaginationParams

export class FetchAnswerAttachmentsUseCase implements UseCase {
  constructor (private readonly answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  async execute (req: FetchAnswerAttachmentsRequest): Promise<PaginatedAnswerAttachments> {
    const { answerId, page, pageSize, order } = req
    return await this.answerAttachmentsRepository.findManyByAnswerId(answerId, { page, pageSize, order })
  }
}
