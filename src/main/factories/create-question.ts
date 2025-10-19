import type { WebController } from '@/core/presentation/web-controller'
import { CreateQuestionUseCase } from '@/domain/application/usecases/create-question/create-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { CreateQuestionController } from '@/presentation/controllers/create-question/create-question.controller'

export function makeCreateQuestionController (): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  return new CreateQuestionController(createQuestionUseCase)
}
