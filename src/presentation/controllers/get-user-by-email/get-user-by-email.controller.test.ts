import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { GetUserByEmailController } from './get-user-by-email.controller'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeUser } from '@/shared/util/factories/domain/make-user'

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

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(getUserByEmailUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an success response with the user data', async () => {
    const user = makeUser()
    vi.spyOn(getUserByEmailUseCase, 'execute').mockResolvedValue(user)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(user)
  })
})
