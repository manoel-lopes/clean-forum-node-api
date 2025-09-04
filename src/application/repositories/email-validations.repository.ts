import type { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'

export type EmailValidationsRepository = {
  save(emailValidation: EmailValidation): Promise<void>
  findByEmail(email: string): Promise<EmailValidation | null>
  findById(id: string): Promise<EmailValidation | null>
  delete(id: string): Promise<void>
}
