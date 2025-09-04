import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { EmailValidationNotFoundError } from './errors/email-validation-not-found.error'
import { ExpiredValidationCodeError } from './errors/expired-validation-code.error'
import { VerifyEmailValidationUseCase } from './verify-email-validation.usecase'

describe('VerifyEmailValidationUseCase', () => {
  let sut: VerifyEmailValidationUseCase
  let emailValidationsRepository: EmailValidationsRepository
  const request = {
    email: 'test@example.com',
    code: '123456'
  }

  beforeEach(() => {
    emailValidationsRepository = {
      save: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      delete: vi.fn()
    }

    sut = new VerifyEmailValidationUseCase(emailValidationsRepository)
  })

  it('should verify email validation successfully', async () => {
    const emailValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate(request.code),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes from now
      isVerified: false
    })

    const verifiedValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate(request.code),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      isVerified: true
    })

    vi.spyOn(emailValidation, 'isExpired').mockReturnValue(false)
    vi.spyOn(emailValidation, 'verify').mockReturnValue(verifiedValidation)
    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(emailValidation)

    await sut.execute(request)

    expect(emailValidationsRepository.findByEmail).toHaveBeenCalledWith(request.email)
    expect(emailValidation.verify).toHaveBeenCalledWith(expect.any(EmailValidationCode))
    expect(emailValidationsRepository.save).toHaveBeenCalledWith(verifiedValidation)
  })

  it('should throw EmailValidationNotFoundError when no validation exists', async () => {
    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(null)

    await expect(sut.execute(request))
      .rejects.toThrow(EmailValidationNotFoundError)

    expect(emailValidationsRepository.findByEmail).toHaveBeenCalledWith(request.email)
    expect(emailValidationsRepository.save).not.toHaveBeenCalled()
  })

  it('should throw ExpiredValidationCodeError when validation is expired', async () => {
    const emailValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate(request.code),
      expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isVerified: false
    })

    vi.spyOn(emailValidation, 'isExpired').mockReturnValue(true)
    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(emailValidation)

    await expect(sut.execute(request))
      .rejects.toThrow(ExpiredValidationCodeError)

    expect(emailValidationsRepository.findByEmail).toHaveBeenCalledWith(request.email)
    expect(emailValidation.isExpired).toHaveBeenCalled()
    expect(emailValidationsRepository.save).not.toHaveBeenCalled()
  })

  it('should return invalid when code format is invalid', async () => {
    const emailValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate('123456'),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      isVerified: false
    })

    vi.spyOn(emailValidation, 'isExpired').mockReturnValue(false)
    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(emailValidation)

    const invalidCodeRequest = { ...request, code: 'invalid' }

    const result = await sut.execute(invalidCodeRequest)
    expect(result).toEqual({ isValid: false })

    expect(emailValidationsRepository.findByEmail).toHaveBeenCalledWith(request.email)
    expect(emailValidationsRepository.save).not.toHaveBeenCalled()
  })

  it('should return invalid when verification fails', async () => {
    const emailValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate('654321'), // Different code
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      isVerified: false
    })

    vi.spyOn(emailValidation, 'isExpired').mockReturnValue(false)
    vi.spyOn(emailValidation, 'verify').mockImplementation(() => {
      throw new Error('Invalid or expired validation code')
    })
    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(emailValidation)

    const result = await sut.execute(request)
    expect(result).toEqual({ isValid: false })

    expect(emailValidationsRepository.findByEmail).toHaveBeenCalledWith(request.email)
    expect(emailValidation.verify).toHaveBeenCalled()
    expect(emailValidationsRepository.save).not.toHaveBeenCalled()
  })

  it('should call repository with correct parameters', async () => {
    const emailValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate(request.code),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      isVerified: false
    })

    const verifiedValidation = EmailValidation.create({
      email: request.email,
      code: EmailValidationCode.validate(request.code),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      isVerified: true
    })

    vi.spyOn(emailValidation, 'isExpired').mockReturnValue(false)
    vi.spyOn(emailValidation, 'verify').mockReturnValue(verifiedValidation)
    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(emailValidation)

    await sut.execute(request)

    const verifyCall = vi.mocked(emailValidation.verify).mock.calls[0]
    expect(verifyCall[0]).toBeInstanceOf(EmailValidationCode)
    expect(verifyCall[0].value).toBe(request.code)
  })
})
