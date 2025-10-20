import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { answerAttachmentSchema } from '../../domain/attachment.schema'

export const updateAnswerAttachmentBodySchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    url: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    const hasTitle = data.title !== undefined
    const hasUrl = data.url !== undefined
    if (!hasTitle && !hasUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided',
      })
    } else if (!hasTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Title is required',
        path: ['title'],
      })
    } else if (!hasUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Link is required',
        path: ['url'],
      })
    }
  })

export const updateAnswerAttachmentParamsSchema = z.object({
  attachmentId: z.uuid(),
})

export const updateAnswerAttachmentResponsesSchema = {
  200: answerAttachmentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema,
}
