import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { DeleteAccountController } from './delete-account.controller'

describe('DeleteAccountController', () => {
  let sut: DeleteAccountController
  let deleteAccountUseCase: UseCase
  beforeEach(() => {
    deleteAccountUseCase = new UseCaseStub()
    sut = new DeleteAccountController(deleteAccountUseCase)
  })
  const httpRequest = {
    params: {
      userId: 'any_id'
    }
  }
  it('should return 404 code and a not found error response if the account is not found', async () => {
    vi.spyOn(deleteAccountUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('User')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })
  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteAccountUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })
  it('should return 204 on successful account deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })
})
