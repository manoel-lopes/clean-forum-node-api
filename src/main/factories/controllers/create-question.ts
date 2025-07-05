import type { WebController } from '@/core/presentation/web-controller'

import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import { CreateQuestionUseCase } from '@/application/usecases/create-question/create-question.usecase'

import { CreateQuestionController } from '@/presentation/controllers/create-question/create-question.controller'

export function makeCreateQuestionController (): WebController {
  const questionsRepository = new InMemoryQuestionsRepository()
  const usersRepository = new InMemoryUsersRepository()
  const createQuestionUseCase = new CreateQuestionUseCase(questionsRepository, usersRepository)
  return new CreateQuestionController(createQuestionUseCase)
}
