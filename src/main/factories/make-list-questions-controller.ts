import {
  ListQuestionsSchemaValidator,
} from '@/infra/validation/schemas/zod/list-questions-schema.validator'
import {
  InMemoryQuestionsRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import {
  ListQuestionsController,
} from '@/presentation/controllers/list-questions/list-questions.controller'

export function makeListQuestionsController () {
  const schemaValidator = new ListQuestionsSchemaValidator()
  const questionsRepository = new InMemoryQuestionsRepository()
  return new ListQuestionsController(schemaValidator, questionsRepository)
}
