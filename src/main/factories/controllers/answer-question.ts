import {
  AnswerQuestionController
} from '@presentation/controllers/answer-question/answer-question.controller'
import { AnswerQuestionUseCase } from '@application/usecases/answer-question/answer-question.usecase'
import {
  InMemoryAnswersRepository
} from '@infra/persistence/repositories/in-memory/in-memory-answers.repository'

export function makeAnswerQuestionController (): AnswerQuestionController {
  const answersRepository = new InMemoryAnswersRepository()
  const answerQuestionUseCase = new AnswerQuestionUseCase(answersRepository)

  return new AnswerQuestionController(answerQuestionUseCase)
}
