import { z } from 'zod'
import { errorResponseSchema } from '@/infra/validation/zod/schemas/core/error-response.schema'
import { answerAttachmentSchema } from '@/infra/validation/zod/schemas/domain/attachment.schema'

export const attachToAnswerBodySchema = z.object({
  title: z.string().min(1).max(255),
  url: z.url(),
})

export const attachToAnswerParamsSchema = z.object({
  answerId: z.uuid(),
})

export const attachToAnswerResponsesSchema = {
  201: answerAttachmentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema,
}
