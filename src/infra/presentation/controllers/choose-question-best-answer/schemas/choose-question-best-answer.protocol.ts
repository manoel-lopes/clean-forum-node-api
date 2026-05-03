import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { questionSchema } from '@/infra/validation/zod/schemas/domain/question.schema'

export const chooseQuestionBestAnswerParamsSchema = z.object({
  answerId: z.uuid(),
})

export const chooseQuestionBestAnswerResponsesSchema = {
  200: questionSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
