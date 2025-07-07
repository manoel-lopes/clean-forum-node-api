import type { WebController } from '@/core/presentation/web-controller'

import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import { DeleteQuestionUseCase } from '@/application/usecases/delete-question/delete-question.usecase'

import { DeleteQuestionController } from '@/presentation/controllers/delete-question/delete-question.controller'

export function makeDeleteQuestionController (): WebController {
  const questionsRepository = new InMemoryQuestionsRepository()
  const deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  return new DeleteQuestionController(deleteQuestionUseCase)
}
