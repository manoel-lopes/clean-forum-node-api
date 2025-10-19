export type RateLimitingErrorCode =
  | 'AUTH_RATE_LIMIT_EXCEEDED'
  | 'USER_CREATION_RATE_LIMIT_EXCEEDED'
  | 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED'

export class RateLimitingError extends Error {
  public readonly code: RateLimitingErrorCode

  constructor (code: RateLimitingErrorCode, message: string) {
    super(message)
    this.code = code
    this.name = 'RateLimitingError'
  }
}
