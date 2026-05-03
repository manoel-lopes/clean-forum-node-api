export type HttpErrorType =
  | 'Bad Request'
  | 'Unauthorized'
  | 'Forbidden'
  | 'Not Found'
  | 'Conflict'
  | 'Unprocessable Entity'
  | 'Too Many Requests'
  | 'Service Unavailable'
  | 'Not Acceptable'
  | 'Payload Too Large'

export type HttpError = {
  readonly name: HttpErrorType
  readonly message?: string
}
