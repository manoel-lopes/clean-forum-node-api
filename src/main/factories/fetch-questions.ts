import { PrismaQuestionsRepository } from '@/infra/persistence/repositories/prisma/prisma-questions.repository'

import { FetchQuestionsUseCase } from '@/application/usecases/fetch-questions/fetch-questions.usecase'

import { FetchQuestionsController } from '@/presentation/controllers/fetch-questions/fetch-questions.controller'

export const makeFetchQuestionsController = (): FetchQuestionsController => {
  const questionsRepository = new PrismaQuestionsRepository()
  const fetchQuestionsUseCase = new FetchQuestionsUseCase(questionsRepository)
  const fetchQuestionsController = new FetchQuestionsController(fetchQuestionsUseCase)
  return fetchQuestionsController
}
