import type { WebController } from '@/core/presentation/web-controller'
import { DeleteAnswerUseCase } from '@/domain/application/usecases/delete-answer/delete-answer.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteAnswerController } from '@/infra/presentation/controllers/delete-answer/delete-answer.controller'

export function makeDeleteAnswerController (): WebController {
  const answersRepo = CachedRepositoriesFactory.createAnswersRepository()
  const deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepo)
  return new DeleteAnswerController(deleteAnswerUseCase)
}
