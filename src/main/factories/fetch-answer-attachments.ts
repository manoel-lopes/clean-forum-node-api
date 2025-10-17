import type { WebController } from '@/core/presentation/web-controller'
import { FetchAnswerAttachmentsUseCase } from '@/domain/application/usecases/fetch-answer-attachments/fetch-answer-attachments.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchAnswerAttachmentsController } from '@/presentation/controllers/fetch-answer-attachments/fetch-answer-attachments.controller'

export function makeFetchAnswerAttachmentsController(): WebController {
  const answerAttachmentsRepository = CachedRepositoriesFactory.createAnswerAttachmentsRepository()
  const fetchAnswerAttachmentsUseCase = new FetchAnswerAttachmentsUseCase(answerAttachmentsRepository)
  return new FetchAnswerAttachmentsController(fetchAnswerAttachmentsUseCase)
}
