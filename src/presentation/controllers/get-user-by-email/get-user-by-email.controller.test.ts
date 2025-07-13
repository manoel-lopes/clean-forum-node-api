import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
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
  it('should return 404 code and an not found error response if user is not found', async () => {
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('User')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })
  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })
  it('should return 200 and an success response with the user data', async () => {
    const user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    vi.spyOn(getUserByEmailUseCase, 'execute').mockResolvedValue(user)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(user)
  })
})
