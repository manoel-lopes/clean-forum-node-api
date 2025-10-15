import type { WebController } from '@/core/presentation/web-controller'
import { UpdateQuestionAttachmentUseCase } from '@/domain/application/usecases/update-question-attachment/update-question-attachment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { UpdateQuestionAttachmentController } from '@/presentation/controllers/update-question-attachment/update-question-attachment.controller'

export function makeUpdateQuestionAttachmentController (): WebController {
  const questionAttachmentsRepository = CachedRepositoriesFactory.createQuestionAttachmentsRepository()
  const updateQuestionAttachmentUseCase = new UpdateQuestionAttachmentUseCase(questionAttachmentsRepository)
  return new UpdateQuestionAttachmentController(updateQuestionAttachmentUseCase)
}
