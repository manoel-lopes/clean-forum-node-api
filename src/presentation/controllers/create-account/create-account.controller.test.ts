import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { UserWithEmailAlreadyRegisteredError } from '@/application/usecases/create-account/errors/user-with-email-already-registered.error'

import { created } from '@/presentation/helpers/http-helpers'

import { CreateAccountController } from './create-account.controller'

describe('CreateAccountController', () => {
  let sut: CreateAccountController
  let createAccountUseCase: UseCase

  beforeEach(() => {
    createAccountUseCase = new UseCaseStub()
    sut = new CreateAccountController(createAccountUseCase)
  })

  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email',
      password: 'P@ssword123'
    }
  }

  it('should return 409 and an conflict error response if the email is already registered', async () => {
    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValue(
      new UserWithEmailAlreadyRegisteredError()
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({
      error: 'Conflict',
      message: 'User with email already registered',
    })
  })

  it('should return an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(createAccountUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on the creation of a account', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(created())
  })
})
