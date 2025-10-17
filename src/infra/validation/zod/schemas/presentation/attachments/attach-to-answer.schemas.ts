import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerAttachmentSchema } from '../../domain/attachment.schema'

export const attachToAnswerBodySchema = z.object({
  title: z.string().min(1).max(255),
  link: z.string().url(),
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
