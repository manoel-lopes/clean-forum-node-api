import { errorResponseSchema } from '../../core/error-response.schema'

export const createAccountResponsesSchema = {
  201: null,
  400: errorResponseSchema,
  409: errorResponseSchema
}
