import z from 'zod'
import type { Attachment } from '@/domain/enterprise/entities/base/attachment.entity'

export const attachmentSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  link: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
}) satisfies z.ZodType<Attachment>

export const answerAttachmentSchema = attachmentSchema.extend({
  answerId: z.uuid(),
})

export const questionAttachmentSchema = attachmentSchema.extend({
  questionId: z.uuid(),
})
