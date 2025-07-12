import { PrismaAnswersRepository } from '@/infra/persistence/repositories/prisma/prisma-answers.repository'

import { FetchAnswersController } from '@/presentation/controllers/fetch-answers/fetch-answers.controller'

export const makeFetchAnswersController = (): FetchAnswersController => {
  const answersRepository = new PrismaAnswersRepository()
  const fetchAnswersController = new FetchAnswersController(answersRepository)
  return fetchAnswersController
}
