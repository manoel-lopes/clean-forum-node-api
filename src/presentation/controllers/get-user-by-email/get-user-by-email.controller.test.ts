import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { notFound, ok } from '@/presentation/helpers/http-helpers'

import { GetUserByEmailController } from './get-user-by-email.controller'

describe('GetUserByEmailController', () => {
  let sut: GetUserByEmailController
  let getUserByEmailUseCase: UseCase

  beforeEach(() => {
    getUserByEmailUseCase = new UseCaseStub()
    sut = new GetUserByEmailController(getUserByEmailUseCase)
  })

  const httpRequest = {
    params: {
      email: 'any_email@mail.com'
    }
  }

  it('should return an not found error response if user is not found', async () => {
    const error = new ResourceNotFoundError('User')
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should return an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return an success response with the user data', async () => {
    const user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    vi.spyOn(getUserByEmailUseCase, 'execute').mockResolvedValue(user)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(user))
  })
})
