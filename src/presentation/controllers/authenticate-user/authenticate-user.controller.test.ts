import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { InvalidPasswordError } from '@/application/usecases/authenticate-user/errors/invalid-password.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
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

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(authenticateUserUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an ok response with the user data on successful authentication', async () => {
    const user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      createdAt: new Date().toISOString()
    }
    vi.spyOn(authenticateUserUseCase, 'execute').mockResolvedValue(user)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    })
  })
})
