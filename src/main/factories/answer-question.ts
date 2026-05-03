import type { WebController } from '@/core/presentation/web-controller'
import { AnswerQuestionUseCase } from '@/domain/application/usecases/answer-question/answer-question.usecase'
import { CachedRepositoriesFactory } from '@/infra/persistence/factories/cached-repositories.factory'
import { AnswerQuestionController } from '@/infra/presentation/controllers/answer-question/answer-question.controller'

export function makeAnswerQuestionController (): WebController {
  const answersRepo = CachedRepositoriesFactory.createAnswersRepository()
  const usersRepo = CachedRepositoriesFactory.createUsersRepository()
  const questionsRepo = CachedRepositoriesFactory.createQuestionsRepository()
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepo, usersRepo, questionsRepo)
  return new AnswerQuestionController(answerQuestionUseCase)
}
