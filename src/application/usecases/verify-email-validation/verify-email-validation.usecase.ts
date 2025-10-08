import type { UseCase } from '@/core/application/use-case'
import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { EmailAlreadyVerifiedError } from './errors/email-already-verified.error'
import { EmailValidationNotFoundError } from './errors/email-validation-not-found.error'
import { ExpiredValidationCodeError } from './errors/expired-validation-code.error'

type VerifyEmailValidationRequest = {
  email: string
  code: string
}

export class VerifyEmailValidationUseCase implements UseCase {
  constructor (
    private readonly emailValidationsRepository: EmailValidationsRepository
  ) {}

  async execute (req: VerifyEmailValidationRequest): Promise<void> {
    const { email, code: codeValue } = req
    const emailValidation = await this.emailValidationsRepository.findByEmail(email)

    if (!emailValidation) {
      throw new EmailValidationNotFoundError()
    }
    if (emailValidation.isVerified) {
      throw new EmailAlreadyVerifiedError()
    }
    if (emailValidation.isExpired()) {
      throw new ExpiredValidationCodeError()
    }
    const code = EmailValidationCode.validate(codeValue)
    const isVerifiedValidation = emailValidation.verify(code)
    await this.emailValidationsRepository.save(isVerifiedValidation)
  }
}
