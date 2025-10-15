import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerAttachmentSchema } from '../../domain/attachment.schema'

export const updateAnswerAttachmentBodySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  link: z.string().url().optional()
}).refine(data => data.title || data.link, {
  message: 'At least one field (title or link) must be provided'
})

export const updateAnswerAttachmentParamsSchema = z.object({
  attachmentId: z.uuid()
})

export const updateAnswerAttachmentResponsesSchema = {
  200: answerAttachmentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema
}
