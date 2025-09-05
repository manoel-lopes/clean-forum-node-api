import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import type { EmailService } from '@/application/services/email-service'
import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { SendEmailValidationError } from './errors/send-email-validation.error'
import { SendEmailValidationUseCase } from './send-email-validation.usecase'

const makeEmailValidationsRepository = (): EmailValidationsRepository => ({
  save: vi.fn(),
  findByEmail: vi.fn(),
  findById: vi.fn(),
  delete: vi.fn()
})

const makeEmailService = (): EmailService => ({
  sendValidationCode: vi.fn()
})

let emailValidationsRepository: EmailValidationsRepository
let emailService: EmailService
let sut: SendEmailValidationUseCase

describe('SendEmailValidationUseCase', () => {
  beforeEach(() => {
    emailValidationsRepository = makeEmailValidationsRepository()
    emailService = makeEmailService()
    sut = new SendEmailValidationUseCase(emailValidationsRepository, emailService)
  })

  it('should send email validation successfully', async () => {
    const request = { email: 'test@example.com' }

    await expect(sut.execute(request)).resolves.not.toThrow()

    expect(emailValidationsRepository.save).toHaveBeenCalledWith(
      expect.any(EmailValidation)
    )
    expect(emailService.sendValidationCode).toHaveBeenCalledWith(
      'test@example.com',
      expect.any(EmailValidationCode)
    )
  })

  it('should throw SendEmailValidationError when email service fails', async () => {
    const request = { email: 'test@example.com' }
    vi.mocked(emailService.sendValidationCode).mockRejectedValue(new Error('Email service error'))

    await expect(sut.execute(request)).rejects.toThrow(
      new SendEmailValidationError('Email service error')
    )
    expect(emailValidationsRepository.save).toHaveBeenCalled()
  })

  it('should throw SendEmailValidationError when repository fails', async () => {
    const request = { email: 'test@example.com' }
    vi.mocked(emailValidationsRepository.save).mockRejectedValue(new Error('Repository error'))

    await expect(sut.execute(request)).rejects.toThrow(
      new SendEmailValidationError('Repository error')
    )
    expect(emailService.sendValidationCode).not.toHaveBeenCalled()
  })

  it('should save email validation with correct data', async () => {
    const request = { email: 'test@example.com' }

    await sut.execute(request)

    const savedEmailValidation = vi.mocked(emailValidationsRepository.save).mock.calls[0][0]
    expect(savedEmailValidation).toBeInstanceOf(EmailValidation)
    expect(savedEmailValidation.email).toBe('test@example.com')
    expect(savedEmailValidation.code).toBeInstanceOf(EmailValidationCode)
    expect(savedEmailValidation.isVerified).toBe(false)
  })
})
