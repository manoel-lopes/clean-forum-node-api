import type { WebController } from '@/core/presentation/web-controller'
import { UpdateQuestionUseCase } from '@/domain/application/usecases/update-question/update-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { UpdateQuestionController } from '@/presentation/controllers/update-question/update-question.controller'

export function makeUpdateQuestionController(): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const updateQuestionUseCase = new UpdateQuestionUseCase(questionsRepository)
  return new UpdateQuestionController(updateQuestionUseCase)
}
