import type { WebController } from '@/core/presentation/web-controller'
import { DeleteQuestionAttachmentUseCase } from '@/domain/application/usecases/delete-question-attachment/delete-question-attachment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteQuestionAttachmentController } from '@/presentation/controllers/delete-question-attachment/delete-question-attachment.controller'

export function makeDeleteQuestionAttachmentController(): WebController {
  const questionAttachmentsRepository = CachedRepositoriesFactory.createQuestionAttachmentsRepository()
  const deleteQuestionAttachmentUseCase = new DeleteQuestionAttachmentUseCase(questionAttachmentsRepository)
  return new DeleteQuestionAttachmentController(deleteQuestionAttachmentUseCase)
}
