import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchQuestionsController } from '@/infra/presentation/controllers/fetch-questions/fetch-questions.controller'

export const makeFetchQuestionsController = (): FetchQuestionsController => {
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const fetchQuestionsController = new FetchQuestionsController(questionsRepo)
  return fetchQuestionsController
}
