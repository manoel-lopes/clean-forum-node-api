import { Entity } from '@/core/domain/entity'
import type { EmailValidationCode } from '@/domain/value-objects/email-validation-code/email-validation-code.vo'
import { ExpiredValidationCodeError } from './errors/expired-validation-code.error'
import { InvalidValidationCodeError } from './errors/invalid-validation-code.error'

export type EmailValidationProps = {
  email: string
  code: EmailValidationCode
  expiresAt: Date
  isVerified: boolean
}

export class EmailValidation extends Entity {
  readonly email: string
  readonly code: EmailValidationCode
  readonly expiresAt: Date
  readonly isVerified: boolean

  private constructor (props: EmailValidationProps, id?: string) {
    super(id)
    Object.assign(this, props)
  }

  static create (props: EmailValidationProps, id?: string): EmailValidation {
    return new EmailValidation(props, id)
  }

  static createForEmail (email: string, code: EmailValidationCode, expirationMinutes: number = 10): EmailValidation {
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes)
    return new EmailValidation({
      email,
      code,
      expiresAt,
      isVerified: false
    })
  }

  verify (providedCode: EmailValidationCode): EmailValidation {
    if (this.isExpired()) {
      throw new ExpiredValidationCodeError()
    }
    if (!this.isCodeValid(providedCode)) {
      throw new InvalidValidationCodeError()
    }
    return new EmailValidation({
      email: this.email,
      code: this.code,
      expiresAt: this.expiresAt,
      isVerified: true
    }, this.id)
  }

  isExpired (): boolean {
    return new Date() > this.expiresAt
  }

  isCodeValid (providedCode: EmailValidationCode): boolean {
    return !this.isVerified && this.code.equals(providedCode)
  }
}
