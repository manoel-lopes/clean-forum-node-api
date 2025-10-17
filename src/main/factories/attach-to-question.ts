import type { WebController } from '@/core/presentation/web-controller'
import { AttachToQuestionUseCase } from '@/domain/application/usecases/attach-to-question/attach-to-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { AttachToQuestionController } from '@/presentation/controllers/attach-to-question/attach-to-question.controller'

export function makeAttachToQuestionController(): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const questionAttachmentsRepository = CachedRepositoriesFactory.createQuestionAttachmentsRepository()
  const attachToQuestionUseCase = new AttachToQuestionUseCase(questionsRepository, questionAttachmentsRepository)
  return new AttachToQuestionController(attachToQuestionUseCase)
}
