import type { WebController } from '@/core/presentation/web-controller'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { AnswerQuestionUseCase } from '@/application/usecases/answer-question/answer-question.usecase'
import { AnswerQuestionController } from '@/presentation/controllers/answer-question/answer-question.controller'

export function makeAnswerQuestionController (): WebController {
  const answersRepository = CachedRepositoriesFactory.createAnswersRepository()
  const usersRepository = CachedRepositoriesFactory.createUsersRepository()
  const questionsRepository = CachedRepositoriesFactory.createQuestionsRepository()
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepository, usersRepository, questionsRepository)
  return new AnswerQuestionController(answerQuestionUseCase)
}
