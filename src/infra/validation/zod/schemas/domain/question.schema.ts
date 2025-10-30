import { z } from 'zod'
import { paginatedItemsSchema } from '../util/functions/paginated-items.schema'
import { answerCommentSchema } from './answer-comment.schema'
import { attachmentSchema } from './attachment.schema'
import { questionCommentSchema } from './question-comment.schema'
import { userSchema } from './user.schema'

export const questionSchema = z.lazy(() => z.object({
  id: z.uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.uuid(),
  bestAnswerId: z.uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  answers: paginatedItemsSchema(z.lazy(() => answerSchemaInternal)).optional(),
  comments: z.array(questionCommentSchema).optional(),
  attachments: z.array(attachmentSchema).optional(),
  author: userSchema.pick({ id: true, name: true, email: true, createdAt: true, updatedAt: true }).optional(),
}))

const answerSchemaInternal = z.lazy(() => z.object({
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
}))
