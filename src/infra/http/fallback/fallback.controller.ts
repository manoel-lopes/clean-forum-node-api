import type { ApiRequest, ApiResponse } from '@/infra/adapters/http/ports/http-protocol'
import { SchemaValidationError } from '@/infra/validation/errors/schema-validation.error'

import { ErrorLogger } from '../helpers/error-logger'

export abstract class FallbackController {
  static handle (error: Error, _: ApiRequest, res: ApiResponse) {
    if (error instanceof SchemaValidationError) {
      return FallbackController.handleSchemaValidationError(error, res)
    }

    ErrorLogger.log(error)
    return res.code(500).send({ error: 'Internal Server Error' })
  }

  private static handleSchemaValidationError (error: SchemaValidationError, res: ApiResponse) {
    const isEmptyRequestBodyError = error.message.includes('empty')
    const isRequiredError = error.message.includes('required')
    const isBadRequestError = isEmptyRequestBodyError || isRequiredError
    if (isBadRequestError) {
      return res.code(400).send({
        error: 'Bad Request',
        message: error.message,
      })
    }

    return res.code(422).send({
      error: 'Unprocessable Entity',
      message: error.message,
    })
  }
}
