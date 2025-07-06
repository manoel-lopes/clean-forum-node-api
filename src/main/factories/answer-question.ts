import type { WebController } from '@/core/presentation/web-controller'

import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import { AnswerQuestionUseCase } from '@/application/usecases/answer-question/answer-question.usecase'

import { AnswerQuestionController } from '@/presentation/controllers/answer-question/answer-question.controller'

export function makeAnswerQuestionController (): WebController {
  const answersRepository = new InMemoryAnswersRepository()
  const usersRepository = new InMemoryUsersRepository()
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepository, usersRepository)
  return new AnswerQuestionController(answerQuestionUseCase)
}
