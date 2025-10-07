import type { EmailValidationsRepository } from '@/domain/application/repositories/email-validations.repository'
import type { EmailService } from '@/domain/application/services/email-service'
import { EmailValidationCode } from '@/domain/enterprise/value-objects/email-validation-code/email-validation-code.vo'
import { SendEmailValidationError } from './errors/send-email-validation.error'

type SendEmailValidationRequest = {
  email: string
}

export class SendEmailValidationUseCase {
  constructor (
    private readonly emailValidationsRepository: EmailValidationsRepository,
    private readonly emailService: EmailService
  ) {}

  async execute ({ email }: SendEmailValidationRequest): Promise<void> {
    try {
      const code = EmailValidationCode.create()
      const expiresAt = new Date()
      expiresAt.setMinutes(expiresAt.getMinutes() + 10)
      await this.emailValidationsRepository.create({
        email,
        code: code.value,
        expiresAt,
        isVerified: false
      })
      await this.emailService.sendValidationCode(email, code)
    } catch (error) {
      throw new SendEmailValidationError(error.message)
    }
  }
}
