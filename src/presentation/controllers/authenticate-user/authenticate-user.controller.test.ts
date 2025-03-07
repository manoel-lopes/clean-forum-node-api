import type { UseCase } from '@/core/application/use-case'
import type { SchemaValidator } from '@/infra/validation/ports/schema.validator'
import { notFound, ok, unauthorized } from '@/presentation/helpers/http-helpers'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import {
  InvalidPasswordError,
} from '@/application/usecases/authenticate-user/errors/invalid-password.error'
import {
  SchemaValidatorStub,
} from '@/infra/validation/schemas/stubs/schema-validator.stub'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { makeUser } from '@/util/factories/domain/make-user'
import { AuthenticateUserController } from './authenticate-user.controller'

describe('AuthenticateUserController', () => {
  let sut: AuthenticateUserController
  let authenticateUserSchemaValidator: SchemaValidator
  let authenticateUserUseCase: UseCase

  beforeEach(() => {
    authenticateUserSchemaValidator = new SchemaValidatorStub()
    authenticateUserUseCase = new UseCaseStub()
    sut = new AuthenticateUserController(
      authenticateUserSchemaValidator,
      authenticateUserUseCase
    )
  })

  const httpRequest = {
    body: {
      email: 'any_email',
      password: 'any_password',
    },
  }

  it('should return an not found error response if the user does not exist', async () => {
    const error = new ResourceNotFoundError('User')
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should return an unauthorized error response if the password is invalid', async () => {
    const error = new InvalidPasswordError()
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized(error))
  })

  it('should throw a schema validation error', async () => {
    const error = new SchemaValidationError('any_error')
    vi.spyOn(authenticateUserSchemaValidator, 'validate').mockImplementation(() => {
      throw error
    })

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should throw an unknown error', async () => {
    const error = new Error('any_error')
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return the authenticated user data', async () => {
    const user = makeUser()
    vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValue(user)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(user))
  })
})
