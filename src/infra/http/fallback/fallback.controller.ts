import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'
import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports/http-server'
import { badRequest, unprocessableEntity } from '@/presentation/helpers/http-helpers'
import { ErrorLogger } from '../helpers/error-logger'

export abstract class FallbackController {
  static handle (error: Error, _: ApiRequest, res: ApiResponse) {
    if (error instanceof SchemaValidationError) {
      const isEmptyRequestBodyError = error.message.includes('empty')
      const isRequiredError = error.message.includes('required')
      const isBadRequestError = isEmptyRequestBodyError || isRequiredError
      const httpError = isBadRequestError ? badRequest(error) : unprocessableEntity(error)
      return res.code(httpError.statusCode).send(httpError.body)
    }

    ErrorLogger.log(error)
    return res.code(500).send({ error: 'Internal Server Error' })
  }
}
