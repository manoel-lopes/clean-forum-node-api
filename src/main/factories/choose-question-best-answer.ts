import type { WebController } from '@/core/presentation/web-controller'

import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import { ChooseQuestionBestAnswerUseCase } from '@/application/usecases/choose-question-best-answer/choose-question-best-answer.usecase'

import { ChooseQuestionBestAnswerController } from '@/presentation/controllers/choose-question-best-answer/choose-question-best-answer.controller'

export function makeChooseQuestionBestAnswerController (): WebController {
  const questionsRepository = new InMemoryQuestionsRepository()
  const answersRepository = new InMemoryAnswersRepository()
  const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(
    questionsRepository,
    answersRepository
  )
  return new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
}
