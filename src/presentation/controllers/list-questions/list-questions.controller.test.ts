import type {
  QuestionsRepository,
} from '@/application/repositories/questions.repository'
import {
  InMemoryQuestionsRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import {
  ListItemsSchemaValidatorStub,
} from '@/infra/validation/schemas/stubs/list-items-schema-validator.stub'
import { ok } from '@/presentation/helpers/http-helpers'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { ListQuestionsController } from './list-questions.controller'

describe('ListQuestionsController', () => {
  let sut: ListQuestionsController
  let listQuestionsSchemaValidator: ListItemsSchemaValidatorStub
  let questionsRepository: QuestionsRepository

  beforeEach(() => {
    listQuestionsSchemaValidator = new ListItemsSchemaValidatorStub()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new ListQuestionsController(
      listQuestionsSchemaValidator,
      questionsRepository
    )
  })

  const httpRequest = { query: { page: 1 } }
  const questions = [
    { createdAt: new Date(2025, 0, 18) },
    { createdAt: new Date(2025, 0, 20) },
    { createdAt: new Date(2025, 0, 22) },
  ]

  const saveQuestions = async (questionsToSave = questions) => {
    for (const question of questionsToSave) {
      await questionsRepository.save(makeQuestion(question))
    }
  }

  it('should throw a schema validation error', async () => {
    const error = new SchemaValidationError('any_error')
    vi.spyOn(listQuestionsSchemaValidator, 'validate').mockImplementation(() => {
      throw error
    })

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a empty list of questions', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({
      items: [],
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 1,
    }))
  })

  it('should return an list of the most recent questions', async () => {
    await saveQuestions()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.body?.items).toHaveProperty('length', questions.length)
    expect(httpResponse.body).toMatchObject({
      items: questions.slice().reverse(),
      page: httpRequest.query.page,
      pageSize: questions.length,
      totalItems: questions.length,
      totalPages: 1,
    })
  })

  it('should return a paginated list of questions', async () => {
    const additionalQuestions = Array.from({ length: 22 }, () => makeQuestion())
    await saveQuestions(additionalQuestions)
    vi.spyOn(listQuestionsSchemaValidator, 'validate').mockReturnValue({
      ...httpRequest.query,
      pageSize: 20,
      page: 2,
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.body?.items).toHaveLength(2)
    expect(httpResponse).toEqual(ok({
      items: additionalQuestions.slice(20, 22),
      page: 2,
      pageSize: 2,
      totalItems: 22,
      totalPages: 2,
    }))
  })
})
