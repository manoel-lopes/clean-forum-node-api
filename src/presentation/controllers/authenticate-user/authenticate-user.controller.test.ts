import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { InvalidPasswordError } from '@/domain/application/usecases/authenticate-user/errors/invalid-password.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { AuthenticateUserController } from './authenticate-user.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('AuthenticateUserController', () => {
  let sut: AuthenticateUserController
  let authenticateUserUseCase: UseCase
  const httpRequest = {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }

  beforeEach(() => {
    authenticateUserUseCase = new UseCaseStub()
    sut = new AuthenticateUserController(authenticateUserUseCase)
  })

  it('should return 404 code and an not found error response if the user is not found', async () => {
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('User')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should return 401 and an unauthorized error response if the password is invalid', async () => {
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(
      new InvalidPasswordError()
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual({
      error: 'Unauthorized',
      message: 'Invalid password',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')

    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an ok response with the user data on successful authentication', async () => {
    vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValue({
      token: 'any_token',
      refreshToken: {
        id: 'any_id',
        userId: 'any_user_id',
        expiresAt: new Date(),
      }
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      token: 'any_token',
      refreshToken: {
        id: 'any_id',
        userId: 'any_user_id',
        expiresAt: expect.any(Date),
      }
    })
  })
})
