export class RateLimitExceededError extends Error {
  constructor (
    readonly code: string,
    message: string,
    readonly retryAfter: number = 60
  ) {
    super(message)
    this.name = 'RateLimitExceededError'
  }
}

export class AuthRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('AUTH', 'Too many authentication attempts', 60)
  }
}

export class UserCreationRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('USER_CREATION', 'Too many account creation attempts', 60)
  }
}

export class SendEmailValidationRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('SEND_EMAIL_VALIDATION', 'Too many email validation send attempts', 60)
  }
}

export class EmailValidationRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('EMAIL_VALIDATION', 'Too many email validation attempts', 60)
  }
}

export class ReadOperationsRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('READ_OPERATION', 'Too many read operations', 60)
  }
}
