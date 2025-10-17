import type { WebController } from '@/core/presentation/web-controller'
import { UpdateAccountUseCase } from '@/domain/application/usecases/update-answer/update-answer.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { UpdateAnswerController } from '@/presentation/controllers/update-answer/update-answer.controller'

export function makeUpdateAnswerController(): WebController {
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const updateAnswerUseCase = new UpdateAccountUseCase(answersRepository)
  return new UpdateAnswerController(updateAnswerUseCase)
}
