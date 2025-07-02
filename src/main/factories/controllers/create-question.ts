import { CreateQuestionController } from '@presentation/controllers/create-question/create-question.controller'
import { CreateQuestionUseCase } from '@application/usecases/create-question/create-question.usecase'
import { InMemoryQuestionsRepository } from '@infra/persistence/repositories/in-memory/in-memory-questions.repository'

export function makeCreateQuestionController(): CreateQuestionController {
  const questionsRepository = new InMemoryQuestionsRepository()
  const createQuestionUseCase = new CreateQuestionUseCase(questionsRepository)

  return new CreateQuestionController(createQuestionUseCase)
}
