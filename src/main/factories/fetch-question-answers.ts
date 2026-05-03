import { FetchQuestionAnswersUseCase } from '@/domain/application/usecases/fetch-question-answers/fetch-question-answers.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchQuestionAnswersController } from '@/infra/presentation/controllers/fetch-question-answers/fetch-question-answers.controller'

export function makeFetchQuestionAnswersController (): FetchQuestionAnswersController {
  const answersRepo = CachedRepositoriesFactory.createAnswersRepository()
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const fetchQuestionAnswersUseCase = new FetchQuestionAnswersUseCase(answersRepo, questionsRepo)
  return new FetchQuestionAnswersController(fetchQuestionAnswersUseCase)
}
