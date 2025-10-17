import type { WebController } from '@/core/presentation/web-controller'
import { UpdateAnswerAttachmentUseCase } from '@/domain/application/usecases/update-answer-attachment/update-answer-attachment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { UpdateAnswerAttachmentController } from '@/presentation/controllers/update-answer-attachment/update-answer-attachment.controller'

export function makeUpdateAnswerAttachmentController(): WebController {
  const answerAttachmentsRepository = CachedRepositoriesFactory.createAnswerAttachmentsRepository()
  const updateAnswerAttachmentUseCase = new UpdateAnswerAttachmentUseCase(answerAttachmentsRepository)
  return new UpdateAnswerAttachmentController(updateAnswerAttachmentUseCase)
}
