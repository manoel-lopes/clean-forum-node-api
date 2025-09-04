import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SendEmailValidationError } from '@/application/usecases/send-email-validation/errors/send-email-validation.error'
import type { SendEmailValidationUseCase } from '@/application/usecases/send-email-validation/send-email-validation.usecase'
import { SendEmailValidationController } from './send-email-validation.controller'

describe('SendEmailValidationController', () => {
  let sut: SendEmailValidationController
  let sendEmailValidationUseCase: SendEmailValidationUseCase
  const httpRequest = {
    body: {
      email: 'test@example.com'
    }
  }

  beforeEach(() => {
    sendEmailValidationUseCase = {
      execute: vi.fn()
    }
    sut = new SendEmailValidationController(sendEmailValidationUseCase)
  })

  it('should send email validation successfully', async () => {
    vi.mocked(sendEmailValidationUseCase.execute).mockResolvedValue()

    const response = await sut.handle(httpRequest)

    expect(sendEmailValidationUseCase.execute).toHaveBeenCalledWith({
      email: 'test@example.com'
    })
    expect(response.statusCode).toBe(204)
    expect(response.body).toBe(null)
  })

  it('should return service unavailable when use case throws SendEmailValidationError', async () => {
    const error = new SendEmailValidationError('Email service is unavailable')
    vi.mocked(sendEmailValidationUseCase.execute).mockRejectedValue(error)

    const response = await sut.handle(httpRequest)

    expect(response.statusCode).toBe(503)
    expect(response.body).toEqual({
      error: 'Service Unavailable',
      message: 'Email service is unavailable'
    })
  })

  it('should throw unexpected errors', async () => {
    const error = new Error('Unexpected error')
    vi.mocked(sendEmailValidationUseCase.execute).mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })
})
