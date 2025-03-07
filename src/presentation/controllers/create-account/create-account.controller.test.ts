import type { UseCase } from '@/core/application/use-case'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import { conflict, created } from '@/presentation/helpers/http-helpers'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import {
  SchemaValidatorStub,
} from '@/infra/validation/schemas/stubs/schema-validator.stub'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import {
  UserWithEmailAlreadyRegisteredError,
} from '@/application/usecases/create-account/errors/user-with-email-already-registered.error'
import { CreateAccountController } from './create-account.controller'

describe('CreateAccountController', () => {
  let sut: CreateAccountController
  let createAccountSchemaValidator: SchemaValidator
  let createAccountUseCase: UseCase

  beforeEach(() => {
    createAccountSchemaValidator = new SchemaValidatorStub()
    createAccountUseCase = new UseCaseStub()
    sut = new CreateAccountController(
      createAccountSchemaValidator,
      createAccountUseCase
    )
  })

  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email',
      password: 'P@ssword123',
    },
  }

  it('should return an conflict error response if the email is already registered', async () => {
    const error = new UserWithEmailAlreadyRegisteredError()
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(conflict(error))
  })

  it('should throw a schema validation error', async () => {
    const error = new SchemaValidationError('any_error')
    vi.spyOn(createAccountSchemaValidator, 'validate').mockImplementation(() => {
      throw error
    })

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should throw an unknown error', async () => {
    const error = new Error('any_error')
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on the creation of a account', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(created())
  })
})
