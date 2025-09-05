import type { EmailService } from '@/application/services/email-service'
import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'

export class EmailServiceStub implements EmailService {
  async sendValidationCode (_email: string, _code: EmailValidationCode): Promise<void> {
    return Promise.resolve()
  }
}
