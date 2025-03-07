export type HttpErrorType =
'Bad Request'
| 'Unauthorized'
| 'Forbidden'
| 'Not Found'
| 'Conflict'
| 'Unprocessable Entity'

export interface HttpError extends Error {
  readonly name: HttpErrorType
  readonly message: string
}
