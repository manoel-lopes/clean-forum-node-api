import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports/http-protocol'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { badRequest, unprocessableEntity } from '@/presentation/helpers/http-helpers'
import { ErrorLogger } from '../helpers/error-logger'

export abstract class FallbackController {
  static handle (error: Error, _: ApiRequest, res: ApiResponse) {
    if (error instanceof SchemaValidationError) {
      return FallbackController.handleSchemaValidationError(error as SchemaValidationError, res)
    }

    // Handle rate limiting errors
    const rateLimitError = error as Error & { statusCode?: number; retryAfter?: number }
    if (rateLimitError.statusCode === 429 || error.message?.includes('Too many email validation attempts')) {
      return res.code(429).send({
        code: 'EMAIL_VALIDATION_RATE_LIMIT_EXCEEDED',
        error: 'Too Many Requests',
        message: 'Too many email validation attempts. Please try again later.',
        retryAfter: rateLimitError.retryAfter || 60
      })
    }

    ErrorLogger.log(error)
    return res.code(500).send({ error: 'Internal Server Error' })
  }

  private static handleSchemaValidationError (error: SchemaValidationError, res: ApiResponse) {
    const isEmptyRequestBodyError = error.message.includes('empty')
    const isRequiredError = error.message.includes('required')
    const isBadRequestError = isEmptyRequestBodyError || isRequiredError
    const { statusCode, body } = isBadRequestError ? badRequest(error) : unprocessableEntity(error)
    return res.code(statusCode).send(body)
  }
}
