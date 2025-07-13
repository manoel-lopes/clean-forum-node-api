import type { WebController } from '@/core/presentation/web-controller'
import { PrismaAnswersRepository } from '@/infra/persistence/repositories/prisma/prisma-answers.repository'
import { DeleteAnswerUseCase } from '@/application/usecases/delete-answer/delete-answer.usecase'
import { DeleteAnswerController } from '@/presentation/controllers/delete-answer/delete-answer.controller'

export function makeDeleteAnswerController (): WebController {
  const answersRepository = new PrismaAnswersRepository()
  const deleteAnswerUseCase = new DeleteAnswerUseCase(answersRepository)
  return new DeleteAnswerController(deleteAnswerUseCase)
}
