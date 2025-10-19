import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import { badRequest, unprocessableEntity } from '@/presentation/helpers/http-helpers'
import { RateLimitExceededError } from '../errors/rate-limit-exceeded.error'
import { ErrorLogger } from '../helpers/error-logger'
import type { ApiRequest, ApiResponse } from '../ports/api'

export abstract class FallbackController {
  static handle (error: Error, _: ApiRequest, res: ApiResponse) {
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
