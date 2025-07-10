import { z } from 'zod'

import { errorResponseSchema } from '../../core/error-response.schema'
import { questionSchema } from '../../domain/question.schema'

export const getQuestionBySlugParamsSchema = z.object({
  slug: z.string()
})

export const getQuestionBySlugResponsesSchema = {
  200: questionSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
