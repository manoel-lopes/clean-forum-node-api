import type { WebController } from '@/core/presentation/web-controller'
import { PrismaQuestionsRepository } from '@/infra/persistence/repositories/prisma/prisma-questions.repository'
import { PrismaUsersRepository } from '@/infra/persistence/repositories/prisma/prisma-users.repository'
import { CreateQuestionUseCase } from '@/application/usecases/create-question/create-question.usecase'
import { CreateQuestionController } from '@/presentation/controllers/create-question/create-question.controller'

export function makeCreateQuestionController (): WebController {
  const questionsRepository = new PrismaQuestionsRepository()
  const usersRepository = new PrismaUsersRepository()
  const createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)
  return new CreateQuestionController(createQuestionUseCase)
}
