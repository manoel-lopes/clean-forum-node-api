import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { ChooseQuestionBestAnswerUseCase } from '@/application/usecases/choose-question-best-answer/choose-question-best-answer.usecase'
import { ChooseQuestionBestAnswerController } from '@/presentation/controllers/choose-question-best-answer/choose-question-best-answer.controller'

export function makeChooseQuestionBestAnswerController (): WebController {
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
    questionsRepository,
    answersRepository
  )
  return new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
}
