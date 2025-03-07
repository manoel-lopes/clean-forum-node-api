import { z } from 'zod'
import type { HttpResponseSchema } from '@/infra/adapters/http/ports/http-server'
import { errorResponseSchema } from '../errors/error-response.schema'

export const createAccountResponseSchema: HttpResponseSchema = {
  201: z.null(),
  400: errorResponseSchema,
  409: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
