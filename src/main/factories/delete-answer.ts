import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteAnswerUseCase } from '@/domain/application/usecases/delete-answer/delete-answer.usecase'
import { DeleteAnswerController } from '@/presentation/controllers/delete-answer/delete-answer.controller'

export function makeDeleteAnswerController (): WebController {
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepository)
  return new DeleteAnswerController(deleteAnswerUseCase)
}
