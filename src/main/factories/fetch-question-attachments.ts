import type { WebController } from '@/core/presentation/web-controller'
import { FetchQuestionAttachmentsUseCase } from '@/domain/application/usecases/fetch-question-attachments/fetch-question-attachments.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchQuestionAttachmentsController } from '@/presentation/controllers/fetch-question-attachments/fetch-question-attachments.controller'

export function makeFetchQuestionAttachmentsController (): WebController {
  const questionAttachmentsRepository = CachedRepositoriesFactory.createQuestionAttachmentsRepository()
  const fetchQuestionAttachmentsUseCase = new FetchQuestionAttachmentsUseCase(questionAttachmentsRepository)
  return new FetchQuestionAttachmentsController(fetchQuestionAttachmentsUseCase)
}
