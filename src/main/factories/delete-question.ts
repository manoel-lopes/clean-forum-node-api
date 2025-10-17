import type { WebController } from '@/core/presentation/web-controller'
import { DeleteQuestionUseCase } from '@/domain/application/usecases/delete-question/delete-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { DeleteQuestionController } from '@/presentation/controllers/delete-question/delete-question.controller'

export function makeDeleteQuestionController(): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  return new DeleteQuestionController(deleteQuestionUseCase)
}
