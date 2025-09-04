import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'

export type EmailValidationProps = {
  email: string
  code: EmailValidationCode
  expiresAt: Date
  isVerified: boolean
}
