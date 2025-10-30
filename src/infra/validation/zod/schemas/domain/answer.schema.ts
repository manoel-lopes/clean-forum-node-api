import z from 'zod'
import { answerCommentSchema } from './answer-comment.schema'
import { attachmentSchema } from './attachment.schema'
import { userSchema } from './user.schema'

export const answerSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  authorId: z.uuid(),
  questionId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  excerpt: z.string(),
  comments: z.array(answerCommentSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  author: userSchema.pick({ id: true, name: true, email: true, createdAt: true, updatedAt: true }).optional(),
})
