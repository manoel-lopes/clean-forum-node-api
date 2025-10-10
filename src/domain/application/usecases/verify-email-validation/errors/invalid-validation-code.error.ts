export class InvalidValidationCodeError extends Error {
  constructor (code?: string) {
    super('Invalid validation code')
    this.name = 'InvalidValidationCodeError'
  }
}
