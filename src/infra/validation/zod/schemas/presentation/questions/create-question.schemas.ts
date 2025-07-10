import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'

export const createQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  authorId: z.string().uuid()
})

export const createQuestionResponsesSchema = {
  201: z.null(),
  400: errorResponseSchema,
  404: errorResponseSchema,
  409: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
