import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const sendEmailValidationBodySchema = z.object({
  email: z.string().email('Invalid email address')
})

export const sendEmailValidationResponsesSchema = {
  204: z.null(),
  400: errorResponseSchema,
  422: errorResponseSchema,
  503: errorResponseSchema,
  500: errorResponseSchema
}
