import type { EmailService } from '@/application/services/email-service'
import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'

export abstract class EmailServiceStub implements EmailService {
  private static sentCodes: Map<string, string> = new Map()

  async sendValidationCode (email: string, code: EmailValidationCode): Promise<void> {
    EmailServiceStub.sentCodes.set(email, code.value)
    return Promise.resolve()
  }

  static getLastCodeForEmail (email: unknown): string | undefined {
    return EmailServiceStub.sentCodes.get(String(email))
  }

  static clearCodes (): void {
    EmailServiceStub.sentCodes.clear()
  }
}
