import { PrismaAnswersRepository } from '@/infra/persistence/repositories/prisma/prisma-answers.repository'

import { FetchAnswersUseCase } from '@/application/usecases/fetch-answers/fetch-answers.usecase'

import { FetchAnswersController } from '@/presentation/controllers/fetch-answers/fetch-answers.controller'

export const makeFetchAnswersController = (): FetchAnswersController => {
  const answersRepository = new PrismaAnswersRepository()
  const fetchAnswersUseCase = new FetchAnswersUseCase(answersRepository)
  const fetchAnswersController = new FetchAnswersController(fetchAnswersUseCase)
  return fetchAnswersController
}
