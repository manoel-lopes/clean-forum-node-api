import type { HttpRequest } from '@/core/presentation/http-protocol'
import { badRequest, unprocessableEntity } from '@/infra/presentation/helpers/http-helpers'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { RateLimitExceededError } from '../errors/rate-limit-exceeded.error'
import { ErrorLogger } from '../helpers/error-logger'
import type { ApiResponse } from '../ports/api'

export abstract class FallbackController {
  static handle (error: Error, _: HttpRequest, res: ApiResponse) {
    if (error instanceof SchemaValidationError) {
      return FallbackController.handleSchemaValidationError(error, res)
    }
    if (error instanceof RateLimitExceededError) {
      return res.code(429).send({
        code: `${error.code}_RATE_LIMIT_EXCEEDED`,
        error: 'Too Many Requests',
        message: `${error.message}. Please try again later.`,
        retryAfter: error.retryAfter,
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
