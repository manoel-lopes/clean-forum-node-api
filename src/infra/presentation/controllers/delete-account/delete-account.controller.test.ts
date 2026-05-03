import { UseCaseStub } from 'tests/helpers/domain/application/use-case.stub'
import type { UseCase } from '@/core/domain/application/use-case'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { DeleteAccountController } from './delete-account.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret',
  },
}))

vi.mock('@/infra/auth/jwt/jwt-service', () => ({
  JWTService: {
    decodeToken: vi.fn().mockReturnValue({ sub: 'user-id' }),
  },
}))

describe('DeleteAccountController', () => {
  let deleteAccountUseCase: UseCase
  let sut: DeleteAccountController
  const httpRequest = {
    headers: {
      authorization: 'Bearer any_token',
    },
  }

  beforeEach(() => {
    deleteAccountUseCase = new UseCaseStub()
    sut = new DeleteAccountController(deleteAccountUseCase)
  })

  it('should return 404 when trying to delete non-existent account', async () => {
    vi.spyOn(deleteAccountUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('User'))
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should return 204 on successful account deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeNull()
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteAccountUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow('any_error')
  })
})
