import { ExpiredRefreshTokenError } from '@/domain/application/usecases/refresh-token/errors/expired-refresh-token.error'
import { RefreshAccessTokenUseCase } from '@/domain/application/usecases/refresh-token/refresh-token.usecase'
import { InMemoryRefreshTokensRepository } from '@/infra/persistence/repositories/in-memory/in-memory-refresh-tokens.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeRefreshToken } from '@/shared/util/factories/domain/make-refresh-token'
import { RefreshAccessTokenController } from './refresh-token.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('RefreshTokenController', () => {
  let refreshTokensRepository: InMemoryRefreshTokensRepository
  let refreshAccessTokenUseCase: RefreshAccessTokenUseCase
  let sut: RefreshAccessTokenController
  const httpRequest = {
    body: {
      refreshTokenId: 'any_refresh_token_id'
    }
  }

  beforeEach(() => {
    refreshTokensRepository = new InMemoryRefreshTokensRepository()
    refreshAccessTokenUseCase = new RefreshAccessTokenUseCase(refreshTokensRepository)
    sut = new RefreshAccessTokenController(refreshAccessTokenUseCase)
  })

  it('should return 404 and a not found error response if the refresh token is not found', async () => {
    vi.spyOn(refreshAccessTokenUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Refresh token'))
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 404,
      body: {
        error: 'Not Found',
        message: 'Refresh token not found',
      }
    })
  })

  it('should return 400 and a bad request error response if the refresh token is expired', async () => {
    const refreshToken = makeRefreshToken({ expiresAt: new Date(Date.now() - 1000) })
    await refreshTokensRepository.create(refreshToken)
    vi.spyOn(refreshAccessTokenUseCase, 'execute').mockRejectedValue(new ExpiredRefreshTokenError())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 400,
      body: {
        error: 'Bad Request',
        message: 'The refresh token has expired',
      }
    })
  })

  it('should propagate unexpected errors', async () => {
    vi.spyOn(refreshAccessTokenUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.handle(httpRequest)).rejects.toThrow(new Error())
  })

  it('should return 200 and the new access token on success', async () => {
    const refreshToken = makeRefreshToken()
    await refreshTokensRepository.create(refreshToken)
    vi.spyOn(refreshAccessTokenUseCase, 'execute').mockResolvedValue({ token: 'any_token' })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('token')
  })
})
