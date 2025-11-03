import type { EmailService } from '../adapters/email/ports/email-service'

export class EmailServiceStub implements EmailService {
  async sendValidationCode () {
    return Promise.resolve()
  }
}
