import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { EmailValidationNotFoundError } from '@/application/usecases/verify-email-validation/errors/email-validation-not-found.error'
import { ExpiredValidationCodeError } from '@/application/usecases/verify-email-validation/errors/expired-validation-code.error'
import { InvalidValidationCodeError } from '@/domain/entities/email-validation/errors/invalid-validation-code.error'
import { VerifyEmailValidationController } from './verify-email-validation.controller'

describe('VerifyEmailValidationController', () => {
  let sut: VerifyEmailValidationController
  let verifyEmailValidationUseCase: UseCase
  const httpRequest = {
    body: {
      email: 'test@example.com',
      code: '123456'
    }
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
      message: error.message
    })
  })

  it('should return 400 when validation code expired', async () => {
    const error = new ExpiredValidationCodeError()
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: error.message
    })
  })

  it('should return 400 when validation code invalid', async () => {
    const error = new InvalidValidationCodeError()
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual({
      error: 'Bad Request',
      message: error.message
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('Unexpected error')
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 when verification succeeds', async () => {
    vi.spyOn(verifyEmailValidationUseCase, 'execute').mockResolvedValue(undefined)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(204)
    expect(response.body).toBeNull()
  })
})
