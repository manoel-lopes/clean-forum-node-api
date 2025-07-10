import type { WebController } from '@/core/presentation/web-controller'

import { PrismaQuestionsRepository } from '@/infra/persistence/repositories/prisma/prisma-questions.repository'

import { DeleteQuestionUseCase } from '@/application/usecases/delete-question/delete-question.usecase'

import { DeleteQuestionController } from '@/presentation/controllers/delete-question/delete-question.controller'

export function makeDeleteQuestionController (): WebController {
  const questionsRepository = new PrismaQuestionsRepository()
  const deleteQuestionUseCase = new DeleteQuestionUseCase(questionsRepository)
  return new DeleteQuestionController(deleteQuestionUseCase)
}
