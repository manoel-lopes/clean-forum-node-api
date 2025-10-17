import type { WebController } from '@/core/presentation/web-controller'
import { AttachToAnswerUseCase } from '@/domain/application/usecases/attach-to-answer/attach-to-answer.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { AttachToAnswerController } from '@/presentation/controllers/attach-to-answer/attach-to-answer.controller'

export function makeAttachToAnswerController(): WebController {
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const answerAttachmentsRepository = CachedRepositoriesFactory.createAnswerAttachmentsRepository()
  const attachToAnswerUseCase = new AttachToAnswerUseCase(answersRepository, answerAttachmentsRepository)
  return new AttachToAnswerController(attachToAnswerUseCase)
}
