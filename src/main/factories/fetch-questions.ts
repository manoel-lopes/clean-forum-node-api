import { PrismaQuestionsRepository } from '@/infra/persistence/repositories/prisma/prisma-questions.repository'
import { FetchQuestionsController } from '@/presentation/controllers/fetch-questions/fetch-questions.controller'

export const makeFetchQuestionsController = (): FetchQuestionsController => {
  const questionsRepository = new PrismaQuestionsRepository()
  const fetchQuestionsController = new FetchQuestionsController(questionsRepository)
  return fetchQuestionsController
}
