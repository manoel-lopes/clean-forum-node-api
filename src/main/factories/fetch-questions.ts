import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchQuestionsController } from '@/presentation/controllers/fetch-questions/fetch-questions.controller'

export const makeFetchQuestionsController = (): FetchQuestionsController => {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const fetchQuestionsController = new FetchQuestionsController(questionsRepository)
  return fetchQuestionsController
}
