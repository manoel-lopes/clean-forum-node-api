import { ChooseQuestionBestAnswerController } from '@presentation/controllers/choose-question-best-answer/choose-question-best-answer.controller'
import { ChooseQuestionBestAnswerUseCase } from '@application/usecases/choose-question-best-answer/choose-question-best-answer.usecase'
import { InMemoryQuestionsRepository } from '@infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { InMemoryAnswersRepository } from '@infra/persistence/repositories/in-memory/in-memory-answers.repository'

export function makeChooseQuestionBestAnswerController(): ChooseQuestionBestAnswerController {
  const questionsRepository = new InMemoryQuestionsRepository()
  const answersRepository = new InMemoryAnswersRepository()
  const chooseQuestionBestAnswerUseCase = new ChooseQuestionBestAnswerUseCase(questionsRepository, answersRepository)

  return new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
}
