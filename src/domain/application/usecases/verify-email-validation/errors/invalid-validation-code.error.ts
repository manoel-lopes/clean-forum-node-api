export class InvalidValidationCodeError extends Error {
  constructor(_code?: string) {
    super('Invalid validation code')
    this.name = 'InvalidValidationCodeError'
  }
}
