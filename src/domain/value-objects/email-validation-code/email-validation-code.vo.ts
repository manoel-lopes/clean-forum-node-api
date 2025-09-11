import crypto from 'node:crypto'

export class InvalidEmailValidationCodeError extends Error {
  constructor (code: string) {
    super(`Invalid email validation code: ${code}. Code must be exactly 6 digits.`)
    this.name = 'InvalidEmailValidationCodeError'
  }
}

export class EmailValidationCode {
  private static readonly MIN_VALUE = 100000
  private static readonly MAX_VALUE = 999999

  private constructor (readonly value: string) {
    if (!EmailValidationCode.isValid(value)) {
      throw new InvalidEmailValidationCodeError(value)
    }
  }

  static create (): EmailValidationCode {
    const code = crypto.randomInt(
      EmailValidationCode.MIN_VALUE,
      EmailValidationCode.MAX_VALUE + 1
    ).toString()
    return new EmailValidationCode(code)
  }

  static validate (value: string): EmailValidationCode {
    if (!this.isValid(value)) {
      throw new InvalidEmailValidationCodeError(value)
    }
    return new EmailValidationCode(value)
  }

  equals (other: EmailValidationCode): boolean {
    return this.value === other.value
  }

  private static isValid (code: string): boolean {
    return Boolean(code) && /^\d{6}$/.test(code) &&
           parseInt(code) >= EmailValidationCode.MIN_VALUE &&
           parseInt(code) <= EmailValidationCode.MAX_VALUE
  }
}
