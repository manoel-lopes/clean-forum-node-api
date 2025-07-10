import type { WebController } from '@/core/presentation/web-controller'

import { PrismaAnswersRepository } from '@/infra/persistence/repositories/prisma/prisma-answers.repository'
import { PrismaQuestionsRepository } from '@/infra/persistence/repositories/prisma/prisma-questions.repository'

import { ChooseQuestionBestAnswerUseCase } from '@/application/usecases/choose-question-best-answer/choose-question-best-answer.usecase'

import { ChooseQuestionBestAnswerController } from '@/presentation/controllers/choose-question-best-answer/choose-question-best-answer.controller'

export function makeChooseQuestionBestAnswerController (): WebController {
  const questionsRepository = new PrismaQuestionsRepository()
  const answersRepository = new PrismaAnswersRepository()
  const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
    questionsRepository,
    answersRepository
  )
  return new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
}
