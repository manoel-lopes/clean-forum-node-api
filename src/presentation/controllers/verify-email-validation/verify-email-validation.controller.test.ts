import type { UseCase } from '@/core/domain/application/use-case'
import { EmailValidationNotFoundError } from '@/domain/application/usecases/verify-email-validation/errors/email-validation-not-found.error'
import { ExpiredValidationCodeError } from '@/domain/application/usecases/verify-email-validation/errors/expired-validation-code.error'
import { InvalidCodeError } from '@/domain/application/usecases/verify-email-validation/errors/invalid-validation-code.error'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { VerifyEmailValidationController } from './verify-email-validation.controller'

describe('VerifyEmailValidationController', () => {
  let sut: VerifyEmailValidationController
  let verifyEmailValidationUseCase: UseCase
  const httpRequest = {
    body: {
      email: 'test@example.com',
      code: '123456',
    },
  }

  beforeEach(() => {
    verifyEmailValidationUseCase = new UseCaseStub()
    sut = new VerifyEmailValidationController(verifyEmailValidationUseCase)
  })

  it('should return 404 when validation not found', async () => {
    const error = new EmailValidationNotFoundError()
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual({
      error: 'Not Found',
      message: error.message,
    })
  })

  it('should return 400 when validation code expired', async () => {
    const error = new ExpiredValidationCodeError()
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: error.message,
    })
  })

  it('should return 400 when validation code invalid', async () => {
    const code = '123456'
    const error = new InvalidCodeError(code)
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: error.message,
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error()
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 when verification succeeds', async () => {
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockImplementation(async () => {})

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeNull()
  })
})
