import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { questionSchema } from '../../domain/question.schema'

export const chooseQuestionBestAnswerParamsSchema = z.object({
  answerId: z.string().uuid()
})

export const chooseQuestionBestAnswerResponsesSchema = {
  200: questionSchema,
  400: errorResponseSchema,
  403: errorResponseSchema,
  404: errorResponseSchema,
  422: errorResponseSchema,
  500: errorResponseSchema,
}
