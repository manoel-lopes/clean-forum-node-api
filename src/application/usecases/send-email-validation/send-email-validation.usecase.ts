import type { EmailValidationsRepository } from '@/application/repositories/email-validations.repository'
import type { EmailService } from '@/application/services/email-service'
import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
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
      const emailValidation = EmailValidation.createForEmail(email, code)
      await this.emailValidationsRepository.save(emailValidation)
      await this.emailService.sendValidationCode(email, code)
    } catch (error) {
      throw new SendEmailValidationError(error.message)
    }
  }
}
