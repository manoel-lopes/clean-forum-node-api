import { EmailValidation } from '@/domain/entities/email-validation/email-validation.entity'
import { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'

export type PrismaEmailValidationData = {
  id: string
  email: string
  code: string
  expiresAt: Date
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

export class PrismaEmailValidationMapper {
  static toDomain (raw: PrismaEmailValidationData): EmailValidation {
    return EmailValidation.create({
      email: raw.email,
      code: EmailValidationCode.validate(raw.code),
      expiresAt: raw.expiresAt,
      isVerified: raw.verified,
    }, raw.id)
  }

  static toPersistence (emailValidation: EmailValidation) {
    return {
      id: emailValidation.id,
      email: emailValidation.email,
      code: emailValidation.code.value,
      expiresAt: emailValidation.expiresAt,
      verified: emailValidation.isVerified,
      createdAt: emailValidation.createdAt,
      updatedAt: new Date(),
    }
  }
}
