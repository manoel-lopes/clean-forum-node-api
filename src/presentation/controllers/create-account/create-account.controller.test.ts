import { UseCaseStub } from 'tests/helpers/domain/application/use-case.stub'
import type { UseCase } from '@/core/domain/application/use-case'
import { UserWithEmailAlreadyRegisteredError } from '@/domain/application/usecases/create-account/errors/user-with-email-already-registered.error'
import { CreateAccountController } from './create-account.controller'

describe('CreateAccountController', () => {
  let sut: CreateAccountController
  let createAccountUseCase: UseCase
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email',
      password: 'P@ssword123',
    },
  }

  beforeEach(() => {
    createAccountUseCase = new UseCaseStub()
    sut = new CreateAccountController(createAccountUseCase)
  })

  it('should return 409 code and an conflict error response if the email is already registered', async () => {
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValue(new UserWithEmailAlreadyRegisteredError())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({
      error: 'Conflict',
      message: 'User with email already registered',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 201 and an created response on the creation of a account', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
