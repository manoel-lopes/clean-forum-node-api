import type { WebController } from '@/core/presentation/web-controller'
import { FetchUserQuestionsUseCase } from '@/domain/application/usecases/fetch-user-questions/fetch-user-questions.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchUserQuestionsController } from '@/presentation/controllers/fetch-user-questions/fetch-user-questions.controller'

export function makeFetchUserQuestionsController(): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const fetchUserQuestionsUseCase = new FetchUserQuestionsUseCase(questionsRepository)
  return new FetchUserQuestionsController(fetchUserQuestionsUseCase)
}
