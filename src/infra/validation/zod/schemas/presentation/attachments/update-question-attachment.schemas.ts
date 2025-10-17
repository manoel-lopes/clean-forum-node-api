import { z } from 'zod'
import { errorResponseSchema } from '../../core/error-response.schema'
import { questionAttachmentSchema } from '../../domain/attachment.schema'

export const updateQuestionAttachmentBodySchema = z.object({
  title: z.string().min(1).max(255).optional(),
  link: z.string().url().optional()
}).superRefine((data, ctx) => {
  const hasTitle = data.title !== undefined
  const hasLink = data.link !== undefined
  if (!hasTitle && !hasLink) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided'
    })
  } else if (!hasTitle) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Title is required',
      path: ['title']
    })
  } else if (!hasLink) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Link is required',
      path: ['link']
    })
  }
})

export const updateQuestionAttachmentParamsSchema = z.object({
  attachmentId: z.uuid()
})

export const updateQuestionAttachmentResponsesSchema = {
  200: questionAttachmentSchema,
  400: errorResponseSchema,
  404: errorResponseSchema,
  500: errorResponseSchema
}
