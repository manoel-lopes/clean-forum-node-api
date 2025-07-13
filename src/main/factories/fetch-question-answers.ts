import { PrismaAnswersRepository } from '@/infra/persistence/repositories/prisma/prisma-answers.repository'
import { FetchQuestionAnswersController } from '@/presentation/controllers/fetch-question-answers/fetch-question-answers.controller'

export const makeFetchQuestionAnswersController = (): FetchQuestionAnswersController => {
  const answersRepository = new PrismaAnswersRepository()
  const fetchQuestionAnswersController = new FetchQuestionAnswersController(answersRepository)
  return fetchQuestionAnswersController
}
