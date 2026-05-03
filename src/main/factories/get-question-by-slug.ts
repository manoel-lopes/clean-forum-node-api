import type { WebController } from '@/core/presentation/web-controller'
import { GetQuestionBySlugUseCase } from '@/domain/application/usecases/get-question-by-slug/get-question-by-slug.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { GetQuestionBySlugController } from '@/infra/presentation/controllers/get-question-by-slug/get-question-by-slug.controller'

export function makeGetQuestionBySlugController (): WebController {
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepo)
  return new GetQuestionBySlugController(getQuestionBySlugUseCase)
}
