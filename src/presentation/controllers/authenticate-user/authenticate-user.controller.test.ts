import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { InvalidPasswordError } from '@/application/usecases/authenticate-user/errors/invalid-password.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { notFound, ok, unauthorized } from '@/presentation/helpers/http-helpers'

import { AuthenticateUserController } from './authenticate-user.controller'

describe('AuthenticateUserController', () => {
  let sut: AuthenticateUserController
  let authenticateUserUseCase: UseCase

  beforeEach(() => {
    authenticateUserUseCase = new UseCaseStub()
    sut = new AuthenticateUserController(authenticateUserUseCase)
  })

  const httpRequest = {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }

  it('should return a not found error response if the user is not found', async () => {
    const error = new ResourceNotFoundError('User')
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should return a bad request error response if the password is invalid', async () => {
    const error = new InvalidPasswordError()
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized(error))
  })

  it('should return an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should call AuthenticateUserUseCase with correct params', async () => {
    const executeSpy = vi.spyOn(authenticateUserUseCase, 'execute')

    await sut.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return an ok response with the user data on successful authentication', async () => {
    const user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      createdAt: new Date()
    }
    vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValue(user)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(user))
  })
})
