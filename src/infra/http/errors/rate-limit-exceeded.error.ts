export class RateLimitExceededError extends Error {
  constructor (readonly code: string, message: string) {
    super(message)
    this.name = 'RateLimitExceededError'
  }
}

export class AuthRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('AUTH', 'Too many authentication attempts')
  }
}

export class UserCreationRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('USER_CREATION', 'Too many account creation attempts')
  }
}

export class EmailValidationRateLimitExceededError extends RateLimitExceededError {
  constructor () {
    super('EMAIL_VALIDATION', 'Too many email validation attempts')
  }
}
