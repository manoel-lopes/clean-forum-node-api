import { InMemoryEmailValidationsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-email-validations.repository'
import { makeEmailValidation } from '@/shared/util/factories/domain/make-email-validation'
import { ExpiredValidationCodeError } from './errors/expired-validation-code.error'
import { VerifyEmailValidationUseCase } from './verify-email-validation.usecase'
import type { EmailValidationsRepository } from '@/domain/application/repositories/email-validations.repository'

describe('VerifyEmailValidationUseCase', () => {
  let sut: VerifyEmailValidationUseCase
  let emailValidationsRepository: EmailValidationsRepository
  const request = {
    email: 'test@example.com',
    code: '123456'
  }

  beforeEach(() => {
    emailValidationsRepository = new InMemoryEmailValidationsRepository()
    sut = new VerifyEmailValidationUseCase(emailValidationsRepository)
  })

  it('should verify email validation successfully', async () => {
    const tenMinutesFromNow = new Date(Date.now() + 1000 * 60 * 10)
    const emailValidation = makeEmailValidation({ expiresAt: tenMinutesFromNow })
    await emailValidationsRepository.create(emailValidation)

    await sut.execute(request)
  })

  it('should throw an error when no validation exists', async () => {
    await expect(sut.execute(request))
      .rejects.toThrowError('No email validation found for this email')
  })

  it('should throw an error when validation is expired', async () => {
    const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60)
    const emailValidation = makeEmailValidation({ expiresAt: oneHourAgo })

    vi.mocked(emailValidationsRepository.findByEmail).mockResolvedValue(emailValidation)

    await expect(sut.execute(request))
      .rejects.toThrow(ExpiredValidationCodeError)

    expect(emailValidationsRepository.findByEmail).toHaveBeenCalledWith(request.email)
    expect(emailValidationsRepository.create).not.toHaveBeenCalled()
  })

  it('should throw an error when code format is invalid', async () => {
    const emailValidation = makeEmailValidation()
    await emailValidationsRepository.create(emailValidation)

    const invalidCodeRequest = { ...request, code: 'invalid' }
    await expect(sut.execute(invalidCodeRequest)).rejects.toThrow('Invalid email validation code: invalid. Code must be exactly 6 digits.')
  })

  it('should return invalid when verification fails', async () => {
    const emailValidation = makeEmailValidation({ code: '654321' })
    await emailValidationsRepository.create(emailValidation)

    await expect(sut.execute(request)).rejects.toThrow('Invalid or expired validation code')
  })

  it('should call repository with correct parameters', async () => {
    const emailValidation = makeEmailValidation()
    await emailValidationsRepository.create(emailValidation)

    await sut.execute(request)

    expect(emailValidationsRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: request.email,
        code: '123456',
        isVerified: true
      })
    )
  })
})
