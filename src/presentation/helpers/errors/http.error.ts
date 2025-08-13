export type HttpErrorType =
  | 'Bad Request'
  | 'Unauthorized'
  | 'Forbidden'
  | 'Not Found'
  | 'Conflict'
  | 'Unprocessable Entity'

export interface HttpError {
  readonly name: HttpErrorType
  readonly message?: string
}
