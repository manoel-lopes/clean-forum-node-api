import type { WebController } from '@/core/presentation/web-controller'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/application/usecases/choose-question-best-answer/choose-question-best-answer.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { ChooseQuestionBestAnswerController } from '@/infra/presentation/controllers/choose-question-best-answer/choose-question-best-answer.controller'

export function makeChooseQuestionBestAnswerController (): WebController {
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const answersRepo = CachedRepositoriesFactory.createAnswersRepository()
  const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(questionsRepo, answersRepo)
  return new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
}
