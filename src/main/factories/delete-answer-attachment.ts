import type { WebController } from '@/core/presentation/web-controller'
import { DeleteAnswerAttachmentUseCase } from '@/domain/application/usecases/delete-answer-attachment/delete-answer-attachment.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteAnswerAttachmentController } from '@/presentation/controllers/delete-answer-attachment/delete-answer-attachment.controller'

export function makeDeleteAnswerAttachmentController(): WebController {
  const answerAttachmentsRepository = CachedRepositoriesFactory.createAnswerAttachmentsRepository()
  const deleteAnswerAttachmentUseCase = new DeleteAnswerAttachmentUseCase(answerAttachmentsRepository)
  return new DeleteAnswerAttachmentController(deleteAnswerAttachmentUseCase)
}
