import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { questionAttachmentSchema } from '@/infra/validation/zod/schemas/domain/attachment.schema'

export const attachToQuestionBodySchema = z.object({
  title: z.string().min(1).max(255),
  url: z.url(),
})

export const attachToQuestionParamsSchema = z.object({
  questionId: z.uuid(),
})

export const attachToQuestionResponsesSchema = {
  201: questionAttachmentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema,
}
