import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import { SendEmailValidationController } from './send-email-validation.controller'
import type { EmailService } from '@/application/services/email-service'

describe('SendEmailValidationController', () => {
  let sut: SendEmailValidationController
  let emailValidationsRepository: EmailValidationsRepository
  let emailService: EmailService
  const httpRequest = {
    body: {
      email: 'test@example.com'
    }
  }

  beforeEach(() => {
    emailValidationsRepository = {
      save: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn()
    }
    emailService = {
      sendValidationCode: vi.fn()
    }
    sut = new SendEmailValidationController(emailValidationsRepository, emailService)
  })

  it('should send email validation successfully', async () => {
    const response = await sut.handle(httpRequest)

    expect(emailValidationsRepository.save).toHaveBeenCalledWith(expect.any(Object))
    expect(emailService.sendValidationCode).toHaveBeenCalledWith(
      httpRequest.body.email,
      expect.any(Object)
    )
    expect(response.statusCode).toBe(204)
    expect(response.body).toBe(null)
  })

  it('should propagate unexpected errors from repository', async () => {
    const unknownError = new Error('Repository error')
    vi.mocked(emailValidationsRepository.save).mockRejectedValue(unknownError)

    await expect(sut.handle(httpRequest)).rejects.toThrow(unknownError)
  })

  it('should propagate unexpected errors from email service', async () => {
    const unknownError = new Error('Email service error')
    vi.mocked(emailService.sendValidationCode).mockRejectedValue(unknownError)

    await expect(sut.handle(httpRequest)).rejects.toThrow(unknownError)
  })
})
