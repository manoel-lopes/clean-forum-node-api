import type { EmailValidationCode } from '@/domain/enterprise/value-objects/email-validation-code/email-validation-code.vo'

export type EmailService = {
  sendValidationCode(email: string, code: EmailValidationCode): Promise<void>
}
