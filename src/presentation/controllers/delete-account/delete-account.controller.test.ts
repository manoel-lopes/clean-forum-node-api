import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { DeleteAccountController } from './delete-account.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('DeleteAccountController', () => {
  let deleteAccountUseCase: UseCase
  let sut: DeleteAccountController
  const httpRequest = {
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    deleteAccountUseCase = new UseCaseStub()
    sut = new DeleteAccountController(deleteAccountUseCase)
  })

  it('should throw an an unexpect error', async () => {
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
