import type { WebController } from '@/core/presentation/web-controller'
import { PrismaAnswersRepository } from '@/infra/persistence/repositories/prisma/prisma-answers.repository'
import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { AnswerQuestionUseCase } from '@/application/usecases/answer-question/answer-question.usecase'
import { AnswerQuestionController } from '@/presentation/controllers/answer-question/answer-question.controller'

export function makeAnswerQuestionController (): WebController {
  const answersRepository = new PrismaAnswersRepository()
  const usersRepository = new PrismaUsersRepository()
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepository, usersRepository)
  return new AnswerQuestionController(answerQuestionUseCase)
}
