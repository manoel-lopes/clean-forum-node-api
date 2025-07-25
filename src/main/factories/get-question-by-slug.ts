import type { WebController } from '@/core/presentation/web-controller'
import { PrismaQuestionsRepository } from '@/infra/persistence/repositories/prisma/prisma-questions.repository'
import { GetQuestionBySlugUseCase } from '@/application/usecases/get-question-by-slug/get-question-by-slug.usecase'
import { GetQuestionBySlugController } from '@/presentation/controllers/get-question-by-slug/get-question-by-slug.controller'

export function makeGetQuestionBySlugController (): WebController {
  const questionsRepository = new PrismaQuestionsRepository()
  const getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  return new GetQuestionBySlugController(getQuestionBySlugUseCase)
}
