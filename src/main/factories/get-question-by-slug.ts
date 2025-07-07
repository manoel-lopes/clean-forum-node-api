import type { WebController } from '@/core/presentation/web-controller'

import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import { GetQuestionBySlugUseCase } from '@/application/usecases/get-question-by-slug/get-question-by-slug.usecase'

import { GetQuestionBySlugController } from '@/presentation/controllers/get-question-by-slug/get-question-by-slug.controller'

export function makeGetQuestionBySlugController (): WebController {
  const questionsRepository = new InMemoryQuestionsRepository()
  const getQuestionBySlugUseCase = new GetQuestionBySlugUseCase(questionsRepository)
  return new GetQuestionBySlugController(getQuestionBySlugUseCase)
}
