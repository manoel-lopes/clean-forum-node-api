export class ExpiredValidationCodeError extends Error {
  constructor () {
    super('Expired validation code')
  }
}
