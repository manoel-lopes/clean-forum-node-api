import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { ExpiredRefreshTokenError } from '@/application/usecases/refresh-token/errors/expired-refresh-token.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { RefreshAccessTokenController } from './refresh-token.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('RefreshTokenController', () => {
  let sut: RefreshAccessTokenController
  let refreshTokenUseCase: UseCase
  const httpRequest = {
    body: {
      refreshTokenId: 'any_refresh_token_id'
    }
  }

  beforeEach(() => {
    refreshTokenUseCase = new UseCaseStub()
    sut = new RefreshAccessTokenController(refreshTokenUseCase)
  })

  it('should return a 404 error when the refresh token is not found', async () => {
    vi.spyOn(refreshTokenUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Refresh token')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Refresh token not found',
    })
  })

  it('should return a 400 error when the refresh token is expired', async () => {
    vi.spyOn(refreshTokenUseCase, 'execute').mockRejectedValue(
      new ExpiredRefreshTokenError()
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual({
      error: 'Bad Request',
      message: 'The refresh token has expired',
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(refreshTokenUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a 200 ok when the refresh token is valid', async () => {
    vi.spyOn(refreshTokenUseCase, 'execute').mockResolvedValue({ token: 'any_access_token' })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ token: 'any_access_token' })
  })
})
