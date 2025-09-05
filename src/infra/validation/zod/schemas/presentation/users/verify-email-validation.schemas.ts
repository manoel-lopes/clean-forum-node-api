import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'

export const verifyEmailValidationBodySchema = z.object({
  email: z.email(),
  code: z.string().length(6).regex(/^\d{6}$/, 'Invalid code')
})

export const verifyEmailValidationResponseSchema = z.object({
  isValid: z.boolean()
})

export const verifyEmailValidationResponsesSchema = {
  200: verifyEmailValidationResponseSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
