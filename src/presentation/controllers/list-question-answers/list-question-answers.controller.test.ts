import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import type { UseCase } from '@/core/application/use-case'
import { ok, notFound } from '@/presentation/helpers/http-helpers'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { SchemaValidatorStub } from '@/infra/validation/schemas/stubs/schema-validator.stub'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { ListQuestionAnswersController } from './list-question-answers.controller'

describe('ListQuestionAnswersController', () => {
  let sut: ListQuestionAnswersController
  let listQuestionsAnswersSchemaValidator: SchemaValidator
  let listQuestionAnswersUseCase: UseCase

  beforeEach(() => {
    listQuestionsAnswersSchemaValidator = new SchemaValidatorStub()
    listQuestionAnswersUseCase = new UseCaseStub()
    sut = new ListQuestionAnswersController(
      listQuestionsAnswersSchemaValidator,
      listQuestionAnswersUseCase
    )
  })

  const httpRequest = { query: { questionId: 'any_question_id', page: 1 } }
  const answers = [
    { id: '1', content: 'Answer 1', createdAt: new Date() },
    { id: '2', content: 'Answer 2', createdAt: new Date() },
  ]

  it('should return an not found error response for a inexistent question', async () => {
    const error = new ResourceNotFoundError('Question')
    vi.spyOn(listQuestionAnswersUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should throw a schema validation error', async () => {
    const error = new SchemaValidationError('any_error')
    vi.spyOn(listQuestionsAnswersSchemaValidator, 'validate').mockImplementation(() => {
      throw error
    })

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a list of the question answers', async () => {
    const response = {
      items: answers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      page: httpRequest.query.page,
      pageSize: answers.length,
      totalItems: answers.length,
      totalPages: 1,
    }
    vi.spyOn(listQuestionAnswersUseCase, 'execute').mockResolvedValue(response)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(response))
  })
})
