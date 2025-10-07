export class InvalidValidationCodeError extends Error {
  constructor (code: string) {
    super(`Invalid validation code: ${code}`)
    this.name = 'InvalidValidationCodeError'
  }
}
