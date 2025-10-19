import { FetchQuestionAnswersUseCase } from '@/domain/application/usecases/fetch-question-answers/fetch-question-answers.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { FetchQuestionAnswersController } from '@/presentation/controllers/fetch-question-answers/fetch-question-answers.controller'

export function makeFetchQuestionAnswersController (): FetchQuestionAnswersController {
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const fetchQuestionAnswersUseCase = new FetchQuestionAnswersUseCase(answersRepository, questionsRepository)
  return new FetchQuestionAnswersController(fetchQuestionAnswersUseCase)
}
