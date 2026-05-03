import type { WebController } from '@/core/presentation/web-controller'
import { FetchUserQuestionsUseCase } from '@/domain/application/usecases/fetch-user-questions/fetch-user-questions.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchUserQuestionsController } from '@/infra/presentation/controllers/fetch-user-questions/fetch-user-questions.controller'

export function makeFetchUserQuestionsController (): WebController {
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const fetchUserQuestionsUseCase = new FetchUserQuestionsUseCase(questionsRepo)
  return new FetchUserQuestionsController(fetchUserQuestionsUseCase)
}
