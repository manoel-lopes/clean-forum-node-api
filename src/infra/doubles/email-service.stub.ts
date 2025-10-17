import type { EmailService } from '../adapters/email/ports/email-service'

export class EmailServiceStub implements EmailService {
  async sendValidationCode(): Promise<void> {
    return Promise.resolve()
  }
}
